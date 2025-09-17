import { useState, useEffect, useRef } from 'react';
// import { Button } from '../ui'; // REMOVE Button import
import { Info } from 'lucide-react';
import clsx from 'clsx';

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect, loading }) => {
  const [showInfo, setShowInfo] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowInfo(null);
      }
    };
    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showInfo]);

  return (
    <div>
      <label className="block text-base font-semibold text-neutral-dark mb-3">
        Room
      </label>{' '}
      {/* Adjusted label style */}
      {loading ? (
        <div className="text-center py-4 text-neutral-medium">
          Loading rooms...
        </div>
      ) : (
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {rooms.map(room => {
            const isSelected = selectedRoom === room.id; // Determine selection status
            return (
              <div key={room.id} className="relative">
                {/* Replaced Button component with a standard <button> for full styling control */}
                <button
                  onClick={() => onRoomSelect(room.id)}
                  className={clsx(
                    // Base styles
                    'w-full h-full p-4 rounded-lg border-2 text-left flex items-center', // Added flex to center icon
                    'font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue',
                    // --- Conditional styles for Room Button ---
                    {
                      // Selected state
                      'bg-brand-blue border-brand-blue text-white shadow-md':
                        isSelected,
                      // Default/Unselected state with desired hover
                      'bg-white border-neutral-light text-neutral-dark hover:bg-neutral-lightest':
                        !isSelected,
                    },
                  )}
                >
                  {/* FIX #3: Removed pr-8, added whitespace-normal for wrapping */}
                  <span className="flex-grow whitespace-normal">
                    {room.name}
                  </span>

                  {/* Info icon is now outside the span to prevent text-wrapping issues */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setShowInfo(showInfo === room.id ? null : room.id);
                    }}
                    className={clsx(
                      'ml-2 flex-shrink-0 p-1 h-6 w-6 rounded-full transition-colors flex items-center justify-center',
                      {
                        'bg-brand-blue text-white': showInfo === room.id, // Active info popup
                        'text-white hover:bg-white/20': !showInfo && isSelected, // Parent selected, info closed
                        'text-neutral-medium hover:bg-neutral-lightest':
                          !showInfo && !isSelected, // Default
                      },
                    )}
                  >
                    <Info size={14} />
                  </button>
                </button>

                {showInfo === room.id && (
                  <div
                    className={clsx(
                      'absolute z-20 bg-white border border-neutral-light rounded-lg shadow-xl p-4 w-64 text-sm',
                      // FIX #2: Centering the tooltip with transform, and then adjusting for edge cases
                      'top-full mt-2 left-1/2 -translate-x-1/2',
                      // Optional: Add more specific positioning if necessary to avoid clipping off-screen
                      // e.g., if the tooltip is the last item in a row and its left edge is too far left
                      // { 'right-0 left-auto translate-x-0': index % 3 === 2 && roomWidthIsSmall }
                    )}
                  >
                    <div className="font-bold text-neutral-dark mb-2">
                      {room.name}
                    </div>
                    {room.description && (
                      <div className="text-neutral-dark mb-2">
                        {room.description}
                      </div>
                    )}
                    {room.capacity && (
                      <div className="text-neutral-medium">
                        Capacity: {room.capacity}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
