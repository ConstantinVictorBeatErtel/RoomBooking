import { useState } from 'react';
import { clsx } from 'clsx';

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
    <div className="w-80 bg-white border border-neutral-light rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-neutral-lightest rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
        >
          {'<'}
        </button>
        <h3 className="text-lg font-semibold text-neutral-dark">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-neutral-lightest rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
        >
          {'>'}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Day headers using our medium neutral color for secondary text */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div
            key={day}
            className="text-sm font-medium text-neutral-medium p-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          // Is the day selected?
          const isSelected = selected && day && day.toDateString() === selected.toDateString();
          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={!day || day < today}
              className={clsx(
                // Base styles for all buttons
                'h-10 w-10 flex items-center justify-center transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-brand-blue/50',
                {
                  invisible: !day,
                  // Apply hover styles ONLY if the day is NOT selected.
                  'text-neutral-dark hover:bg-neutral-lightest hover:text-neutral-dark rounded-lg':
            !isSelected && day && day >= today,
                  // Apply brand-color only if the day is selected
                  'bg-brand-blue text-white font-bold rounded-lg': isSelected,
                  // Apply disabled styles only if the day is in the past
                  'text-neutral-medium cursor-not-allowed rounded-lg': day && day < today,
                },
              )}
            >
              {day ? day.getDate() : ''}
            </button>
          );
        })
        }
      </div>
    </div>
  );
};

export default Calendar;
