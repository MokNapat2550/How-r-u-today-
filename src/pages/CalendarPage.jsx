import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bell, X, Plus, Notebook, ChevronLeft, ChevronRight, Laugh, Smile, Meh, Frown, Angry } from 'lucide-react';

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ...
};

const getDayString = (date) => {
  // Use local date parts to avoid timezone issues with toISOString()
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`; // YYYY-MM-DD
}

// --- Modals for CalendarPage ---

/**
 * MoodModal Component
 * Pops up when a day is clicked.
 */
const MoodModal = ({ selectedDay, onClose, onOpenPlan, onOpenNote }) => {
  const { addMood } = useAppContext();
  const moods = [
    { name: 'Happy', icon: Laugh },
    { name: 'Good', icon: Smile },
    { name: 'Okay', icon: Meh },
    { name: 'Sad', icon: Frown },
    { name: 'Angry', icon: Angry },
  ];

  const handleMoodSelect = (mood) => {
    addMood(getDayString(selectedDay), mood.name);
    onClose();
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
              title={mood.name}
            >
              <mood.icon size={32} />
              <span className="text-xs mt-1">{mood.name}</span>
            </button>
          ))}
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

/**
 * PlanModal Component
 * Pops up to add a new plan.
 */
const PlanModal = ({ selectedDay, onClose, addNotification }) => {
  const { addPlan } = useAppContext();
  const [planText, setPlanText] = useState('');

  const handleSave = () => {
    const trimmedPlan = planText.trim();
    if (trimmedPlan) {
      addPlan(getDayString(selectedDay), trimmedPlan);
      
      // General notification trigger for the most recent plan
      setTimeout(() => {
        addNotification({
          id: Date.now(),
          title: 'เกี่ยวกับแผนล่าสุดของคุณ',
          message: `"${trimmedPlan}" เป็นอย่างไรบ้าง?`
        });
      }, 10000); // 30 seconds
      
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
          placeholder="e.g., ทานข้าวกับเพื่อน"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

/**
 * NoteModal Component
 * Pops up to add/view a note.
 */
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

/**
 * CalendarPage Component
 * The main calendar view.
 */
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
    // Blank days before start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days in month
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

  // Find upcoming plans
  const upcomingPlans = useMemo(() => {
    const today = getDayString(new Date());
    return Object.entries(plans)
      .filter(([dateString]) => dateString >= today)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(0, 3); // Show 3 upcoming
  }, [plans]);

  const getMoodIcon = (moodName) => {
    switch (moodName) {
      case 'Happy': return '😄';
      case 'Good': return '😊';
      case 'Okay': return '😐';
      case 'Sad': return '😢';
      case 'Angry': return '😠';
      default: return null;
    }
  };

  return (
    <div className="p-4 bg-blue-50 (#D9F3FF... close enough) min-h-screen">
      {/* Header with Notifications */}
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
      
      {/* Calendar Grid */}
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

            return (
              <div
                key={dayStr}
                onClick={() => handleDayClick(day)}
                /* --- 💎 นี่คือจุดที่แก้ไขครับ: ลบ 'cursor-pointer' ออกแล้ว --- */
                className={`h-20 p-1 border border-gray-100 rounded-md overflow-hidden hover:bg-blue-50 relative ${isToday ? 'bg-blue-100' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm ${isToday ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                    {day.getDate()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {mood && <span className="text-xs" title={mood}>{getMoodIcon(mood)}</span>}
                    {note && <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedDay(day); setShowNoteModal(true);}} 
                                className="text-xs text-pink-500"
                                title="View Note"
                              ><Notebook size={12} /></button>}
                  </div>
                </div>
                <div className="mt-1 text-left">
                  {dayPlans.slice(0, 2).map((plan, i) => (
                    <div key={i} className="text-xs bg-blue-100 text-blue-800 rounded px-1 truncate">
                      {plan}
                    </div>
                  ))}
                  {dayPlans.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Plans Section */}
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

      {/* Modals */}
      {showMoodModal && selectedDay && (
        <MoodModal
          selectedDay={selectedDay}
          onClose={() => setShowMoodModal(false)}
          onOpenPlan={() => { setShowMoodModal(false); setShowPlanModal(true); }}
          onOpenNote={() => { setShowMoodModal(false); setShowNoteModal(true); }}
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