import { useState } from 'react';

const Calendar = ({ selected, onSelect, _mode = 'single' }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(selected || today);

  const getDaysInMonth = date => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleDayClick = day => {
    if (day && day >= today) {
      onSelect(day);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 p-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            disabled={!day || day < today}
            className={`
              p-2 text-sm rounded-md transition-colors
              ${!day ? 'invisible' : ''}
              ${
          day && day < today
            ? 'text-gray-300 cursor-not-allowed'
            : 'hover:bg-gray-100'
          }
              ${
          selected &&
                day &&
                day.toDateString() === selected.toDateString()
            ? 'bg-blue-600 text-white'
            : 'text-gray-700'
          }
            `}
          >
            {day ? day.getDate() : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
