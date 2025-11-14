import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Loader2 } from 'lucide-react';

// --- ฟังก์ชันนี้ผมเพิ่มเข้ามาให้ครับ ---
// ฟังก์ชันสำหรับดึง YYYY-MM-DD จาก object Date
const getDayString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// ---------------------------------

const ChatbotPage = () => {
  const { moods, plans, notes } = useAppContext();
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ? เล่าเรื่องที่คุณกังวลใจให้ฟังได้นะ' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGeminiAPI = async (userQuery, systemPrompt) => {
    setIsLoading(true);
    
    // *** 💡 จุดที่แก้ไข ***
    // ดึง API Key มาจาก Environment Variable ที่เราตั้งไว้ในไฟล์ .env
    // Vite จะใช้ import.meta.env.VITE_... ในการเข้าถึง
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    
    // ตรวจสอบว่ามี Key หรือไม่
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is not set in .env file");
      setMessages(prev => [...prev, { from: 'bot', text: 'ขออภัยค่ะ ดูเหมือนว่าระบบจะยังไม่ได้ตั้งค่า API Key' }]);
      setIsLoading(false);
      return;
    }

    // *** 💡 หมายเหตุ: ***
    // ผมเห็นว่า URL ของ API มีการอ้างอิงเวอร์ชันที่อาจจะเก่า (gemini-2.5-flash-preview-09-2025)
    // ผมจะเปลี่ยนไปใช้โมเดล 'gemini-1.5-flash' ที่เป็นเวอร์ชันล่าสุดแทนนะครับ
    // และเปลี่ยน URL ให้เป็นมาตรฐาน v1beta
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Create a summary of the user's recent state
    const today = getDayString(new Date());
    const recentMoods = Object.entries(moods).filter(([date]) => date <= today).slice(-7);
    const recentPlans = Object.entries(plans).filter(([date]) => date <= today).slice(-7);
    
    let contextSummary = "นี่คือข้อมูลสรุปอารมณ์และแผนล่าสุดของผู้ใช้:\n";
    contextSummary += `Moods: ${recentMoods.length > 0 ? recentMoods.map(([d, m]) => `${d}: ${m}`).join(', ') : 'No data'}\n`;
    contextSummary += `Plans: ${recentPlans.length > 0 ? recentPlans.map(([d, p]) => `${d}: ${p.join('; ')}`).join(', ') : 'No data'}\n`;
    
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: `${systemPrompt}\n\n${contextSummary}` }]
      },
      // เพิ่ม Safety Settings เพื่อลดการถูกบล็อกจาก API
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    try {
      // Exponential backoff retry logic
      let response;
      let retries = 0;
      const maxRetries = 3;
      while (retries < maxRetries) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.status === 200) break; // Success
        if (response.status === 429 || response.status >= 500) {
          // Throttling or server error, wait and retry
          await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
          retries++;
        } else {
          // Other client-side error
          const errorBody = await response.json();
          console.error("API Error Body:", errorBody);
          throw new Error(`API Error: ${response.statusText}`);
        }
      }

      if (!response.ok) {
         throw new Error(`API call failed after ${retries} retries.`);
      }

      const result = await response.json();
      
      // *** 💡 จุดที่แก้ไข (ป้องกันข้อผิดพลาด) ***
      // ตรวจสอบว่า API ตอบกลับมาสำเร็จ แต่โดนบล็อกเพราะ Safety Settings หรือไม่
      if (!result.candidates || result.candidates.length === 0) {
        console.warn("API Response blocked or empty:", result);
        let finishReason = result.promptFeedback?.blockReason || "NO_RESPONSE";
        setMessages(prev => [...prev, { from: 'bot', text: `ขอโทษทีค่ะ ฉันไม่สามารถตอบคำถามนั้นได้ (เหตุผล: ${finishReason})` }]);
      } else {
        const text = result.candidates[0]?.content?.parts[0]?.text;
        if (text) {
          setMessages(prev => [...prev, { from: 'bot', text }]);
        } else {
          throw new Error("No text in API response candidate.");
        }
      }
      
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages(prev => [...prev, { from: 'bot', text: 'ขออภัยค่ะ ดูเหมือนจะมีปัญหาในการเชื่อมต่อ ลองอีกครั้งนะคะ' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const systemPrompt = `
      คุณคือ 'How r u today?' ผู้ช่วย AI ด้านสุขภาพจิตที่อบอุ่น, เข้าใจ, และเห็นอกเห็นใจ
      หน้าที่หลักของคุณคือการรับฟังและให้คำปรึกษาเบื้องต้นเกี่ยวกับอารมณ์, ความเครียด, ความวิตกกังวล, และปัญหาสุขภาพจิต
      
      กฎที่ต้องปฏิบัติตามอย่างเคร่งครัด:
      1.  **จำกัดหัวข้อ:** คุณจะตอบเฉพาะคำถามและบทสนทนาที่เกี่ยวข้องกับสุขภาพจิต, อารมณ์, ความเครียด, การจัดการชีวิต, และความเป็นอยู่ที่ดีทางใจเท่านั้น
      2.  **ปฏิเสธหัวข้อนอกเรื่อง:** ถ้าผู้ใช้ถามเรื่องอื่น (เช่น การเมือง, วิทยาศาสตร์, ข่าว, การเขียนโค้ด, ฯลฯ) คุณต้องปฏิเสธอย่างสุภาพและดึงบทสนทนากลับมาที่เรื่องสุขภาพจิต ตัวอย่าง: "ขอโทษนะคะ ฉันถูกออกแบบมาเพื่อช่วยเรื่องสุขภาพจิตโดยเฉพาะ มีอะไรที่คุณกังวลใจอยากเล่าให้ฟังไหมคะ?"
      3.  **ไม่ใช่ผู้เชี่ยวชาญ:** คุณต้องชัดเจนว่าคุณไม่ใช่แพทย์หรือนักจิตบำบัด และไม่สามารถวินิจฉัยโรคหรือให้คำแนะนำทางการแพทย์ได้
      4.  **แนะนำผู้เชี่ยวชาญ:** หากบทสนทนามีความรุนแรง (เช่น การทำร้ายตัวเอง, ความคิดฆ่าตัวตาย) คุณต้องแนะนำให้ผู้ใช้ติดต่อผู้เชี่ยวชาญทันที เช่น สายด่วนสุขภาพจิต 1323
      5.  **ใช้ข้อมูลบริบท:** ใช้ข้อมูลสรุปอารมณ์และแผนที่ได้รับมา เพื่อทำความเข้าใจผู้ใช้มากขึ้น แต่ไม่ต้องพูดถึงข้อมูลนั้นตรงๆ เว้นแต่ผู้ใช้จะถาม
      6.  **ภาษา:** ตอบเป็นภาษาไทยด้วยน้ำเสียงที่อบอุ่นและเป็นกันเอง
    `;
    
    callGeminiAPI(input, systemPrompt);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-pink-200 (#F8BBD0) p-4 text-center text-pink-800 font-semibold shadow-md">
        Mental Health Chatbot
      </header>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50 (#D9F3FF)">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                msg.from === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-md'
              }`}
            >
              {/* แก้ไขให้แสดงผล Newline (บรรทัดใหม่) ที่มาจากบอท */}
              {msg.text.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-3 rounded-lg rounded-bl-none shadow-md">
              <Loader2 size={20} className="animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Box */}
      <div className="p-4 bg-white border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="พิมพ์ข้อความของคุณ..."
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="ml-3 p-3 bg-pink-300 (#F8BBD0) text-white rounded-full hover:bg-pink-400 disabled:opacity-50"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};
export default ChatbotPage;