import { useRef } from 'react';
import { Tooltip } from 'flowbite-react';
import clsx from 'clsx';

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect, onRoomIdSelect, loading }) => {
  const containerRef = useRef(null);
  return (
    <div>
      {loading ? (
        <div className="text-center py-4 text-neutral-medium">
          Loading rooms...
        </div>
      ) : (
        <div
          id="room-selector-grid"
          ref={containerRef}
          className="flex flex-wrap gap-4"
        >
          {rooms.map(room => {
            const isSelected = selectedRoom === room.id; // Determine selection status
            return (
              <div key={room.id} className="relative">
                {/* For flowbite-react, we wrap the tooltip around the button */}
                <Tooltip
                  placement="right"
                  content={
                    <div className="w-64">
                      {room.description && (
                        <div className="text-neutral-lightest mb-2">
                          {room.description}
                        </div>
                      )}
                      {room.capacity && (
                        <div className="text-neutral-lightest">
                          Capacity: {room.capacity}
                        </div>
                      )}
                    </div>
                  }
                >
                  {/* Don't use Button.js here, so we can be more controlling about styles */}
                  <button
                    onClick={() => {
                      // If clicking the already selected room, deselect it
                      if (selectedRoom === room.id) {
                        onRoomSelect(null);
                      } else {
                        onRoomSelect(room.id);
                      }
                      if (onRoomIdSelect) onRoomIdSelect(room.id);
                    }}
                    className={clsx(
                      'w-full h-full p-4 rounded-lg border-2 text-left flex items-center',
                      'font-semibold transition-all duration-150 ease-in-out text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue',
                      {
                        'bg-brand-blue border-brand-blue text-white shadow-md':
                            isSelected,
                        'bg-white border-neutral-light text-neutral-dark hover:bg-neutral-lightest':
                            !isSelected,
                      },
                    )}
                  >
                    {/* Name of the room */}
                    <span className="flex-grow whitespace-normal">
                      {room.name}
                    </span>
                  </button>
                </Tooltip>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
