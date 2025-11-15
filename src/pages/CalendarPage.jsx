import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bell, X, Plus, Notebook, ChevronLeft, ChevronRight} from 'lucide-react';
import happyIcon from '../assets/moods/สนุกสนาน.png';
import goodIcon from '../assets/moods/สบายใจ.png';
import okayIcon from '../assets/moods/ปกติ.png';
import sadIcon from '../assets/moods/ซึม.png';
import angryIcon from '../assets/moods/หน้ามุ่ย.png';

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); 
};

const getDayString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`; 
}

const getMoodIcon = (moodName) => {
  switch (moodName) {
    case 'Happy': return happyIcon;
    case 'Good': return goodIcon;
    case 'Okay': return okayIcon;
    case 'Sad': return sadIcon;
    case 'Angry': return angryIcon;
    default: return null;
  }
};

// 💎 MoodModal
const MoodModal = ({ selectedDay, onClose, onOpenPlan, onOpenNote, currentMood, currentPlans, currentNote }) => {
  const { addMood, deletePlan, deleteNote } = useAppContext();
  const dayString = getDayString(selectedDay);

  const moods = [
    { name: 'Happy', icon: happyIcon },
    { name: 'Good', icon: goodIcon },
    { name: 'Okay', icon: okayIcon },
    { name: 'Sad', icon: sadIcon },
    { name: 'Angry', icon: angryIcon },
  ];

  // --- 💎 จุดที่แก้ไข (1/3): ลบ onClose() ออก ---
  const handleMoodSelect = (mood) => {
    addMood(dayString, mood.name);
    // onClose(); // <-- เอาออก
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {selectedDay.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={20} /></button>
        </div>
        <p className="mb-4 text-center text-gray-600">วันนี้คุณรู้สึกอย่างไร?</p>
        <div className="flex justify-around mb-6">
          {moods.map(mood => (
            <button
              key={mood.name}
              onClick={() => handleMoodSelect(mood)}
              className="flex flex-col items-center text-gray-600 hover:text-pink-400"
            >
            <img 
                src={mood.icon} 
                alt={mood.name} 
                className="w-12 h-12 md:w-16 md:h-16" 
            />
              <span className="text-xs md:text-sm mt-1">{mood.name}</span>
            </button>
          ))}
        </div>

        {/* --- ส่วนแสดงข้อมูลที่บันทึกไว้ (เหมือนเดิม) --- */}
        <div className="mb-6 border-t pt-4 space-y-2 text-sm">
          <h4 className="text-center font-semibold text-gray-500 mb-2">ข้อมูลที่บันทึกไว้</h4>
          
          {currentMood && (
            <div className="flex items-center">
              <span className="font-semibold w-16">Mood:</span>
              <img src={getMoodIcon(currentMood)} alt={currentMood} className="w-12 h-12 mr-1" /> 
              <span className="text-gray-700">{currentMood}</span>
            </div>
          )}

          {currentPlans.length > 0 && (
            <div className="flex items-start">
              <span className="font-semibold w-16 shrink-0">Plans:</span>
              <ul className="list-disc list-inside text-gray-700 w-full">
                {currentPlans.map((plan, i) => (
                  <li 
                    key={i} 
                    className="flex justify-between items-center group hover:bg-gray-50 rounded px-1"
                  >
                    <span>{plan}</span>
                    <button 
                      onClick={() => deletePlan(dayString, i)}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      title="Delete plan"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentNote && (
            <div className="flex items-start group">
              <span className="font-semibold w-16 shrink-0">Note:</span>
              <p className="text-gray-700 italic truncate flex-1">"{currentNote}"</p>
              <button 
                onClick={() => deleteNote(dayString)}
                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                title="Delete note"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {(!currentMood && currentPlans.length === 0 && !currentNote) && (
            <p className="text-center text-gray-400">ยังไม่มีข้อมูลสำหรับวันนี้</p>
          )}
        </div>
        
        <div className="flex justify-around">
          <button
            onClick={onOpenPlan}
            className="px-6 py-2 bg-blue-100 (#D9F3FF) text-blue-800 rounded-full font-semibold hover:bg-blue-200"
          >
            <Plus size={16} className="inline mr-1" />
            Plan
          </button>
          <button
            onClick={onOpenNote}
            className="px-6 py-2 bg-pink-100 (#F8BBD0) text-pink-800 rounded-full font-semibold hover:bg-pink-200"
          >
            <Notebook size={16} className="inline mr-1" />
            Note
          </button>
        </div>
      </div>
    </div>
  );
};

// --- (PlanModal และ NoteModal เหมือนเดิม) ---
const PlanModal = ({ selectedDay, onClose, addNotification }) => {
  const { addPlan } = useAppContext();
  const [planText, setPlanText] = useState('');

  const handleSave = () => {
    const trimmedPlan = planText.trim();
    if (trimmedPlan) {
      addPlan(getDayString(selectedDay), trimmedPlan);
      
      setTimeout(() => {
        addNotification({
          id: Date.now(),
          title: 'เกี่ยวกับแผนล่าสุดของคุณ',
          message: `"${trimmedPlan}" เป็นอย่างไรบ้าง?`
        });
      }, 10000);
      
      setPlanText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Add Plan for {selectedDay.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })}</h3>
        <input
          type="text"
          value={planText}
          onChange={(e) => setPlanText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="วันนี้มีอะไรที่อยากทำบ้างง"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

const NoteModal = ({ selectedDay, onClose }) => {
  const { notes, addNote } = useAppContext();
  const dayString = getDayString(selectedDay);
  const [noteText, setNoteText] = useState(notes[dayString] || '');

  const handleSave = () => {
    addNote(dayString, noteText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Note for {selectedDay.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })}</h3>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Note anything here..."
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Close</button>
          <button onClick={handleSave} className="px-4 py-2 bg-pink-400 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

// --- CalendarPage component ---
const CalendarPage = () => {
  const { moods, plans, notes } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weekdays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [year, month, daysInMonth, firstDay]);

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setShowMoodModal(true);
  };

  const changeMonth = (offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const upcomingPlans = useMemo(() => {
    const today = getDayString(new Date());
    return Object.entries(plans)
      .filter(([dateString]) => dateString >= today)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(0, 3); 
  }, [plans]);

  const selectedDayStr = selectedDay ? getDayString(selectedDay) : null;
  const selectedMood = selectedDayStr ? moods[selectedDayStr] : null;
  const selectedPlans = selectedDayStr ? plans[selectedDayStr] || [] : [];
  const selectedNote = selectedDayStr ? notes[selectedDayStr] : null;

  return (
    <div className="p-4 bg-blue-50 (#D9F3FF... close enough) min-h-screen">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">
          {currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-gray-600 hover:text-pink-400">
            <Bell size={24} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 p-4">
              <h4 className="font-semibold mb-2">Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No new notifications.</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="border-b last:border-b-0 py-2">
                    <h5 className="font-bold text-sm">{notif.title}</h5>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </header>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600">
          {weekdays.map(day => (
            <div key={day} className="py-2 text-sm">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="h-20"></div>;

            const dayStr = getDayString(day);
            const mood = moods[dayStr];
            const dayPlans = plans[dayStr] || [];
            const note = notes[dayStr];
            const isToday = dayStr === getDayString(new Date());

            const hasData = mood || dayPlans.length > 0 || note;

            return (
              <div
                key={dayStr}
                onClick={() => handleDayClick(day)}
                className={`h-20 p-1 border border-gray-100 rounded-md hover:bg-blue-50 relative ${isToday ? 'bg-blue-100' : 'bg-white'}`}
              >
                <div className="flex flex-col items-center justify-start h-full">
                  <span className={`text-sm ${isToday ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                    {day.getDate()}
                  </span>
                  
                  {hasData && (
                    <div className="mt-2 w-2 h-2 bg-pink-400 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Plans</h3>
        {upcomingPlans.length > 0 ? (
          <ul className="space-y-2">
            {upcomingPlans.map(([dateString, planItems]) => (
              <li key={dateString} className="border-b pb-2 last:border-b-0">
                <span className="font-bold text-pink-500">
                  {new Date(dateString + 'T00:00:00').toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' })}:
                </span>
                <span className="ml-2 text-gray-800">{planItems.join(', ')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming plans. Time to relax!</p>
        )}
      </div>

      {/* --- 💎 จุดที่แก้ไข (2/3 และ 3/3) --- */}
      {showMoodModal && selectedDay && (
        <MoodModal
          selectedDay={selectedDay}
          onClose={() => setShowMoodModal(false)}
          onOpenPlan={() => setShowPlanModal(true)} // <-- แก้ไข
          onOpenNote={() => setShowNoteModal(true)} // <-- แก้ไข
          currentMood={selectedMood}
          currentPlans={selectedPlans}
          currentNote={selectedNote}
        />
      )}
      {showPlanModal && selectedDay && (
        <PlanModal
          selectedDay={selectedDay}
          onClose={() => setShowPlanModal(false)}
          addNotification={addNotification}
        />
      )}
      {showNoteModal && selectedDay && (
        <NoteModal
          selectedDay={selectedDay}
          onClose={() => setShowNoteModal(false)}
        />
      )}
    </div>
  );
};

export default CalendarPage;