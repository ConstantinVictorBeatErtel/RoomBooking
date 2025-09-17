// import { useState, useEffect, useRef } from 'react';
import { useRef } from 'react';
import { Building2 } from 'lucide-react';
import { Tooltip } from 'flowbite-react';
import clsx from 'clsx';

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect, loading }) => {
  const containerRef = useRef(null);
  return (
    <div>
      {/* Label "Room" */}
      <label className="block text-base font-semibold text-neutral-dark mb-3 flex items-center">
        <Building2 className="mr-2 h-5 w-5" />
        Available Rooms
      </label>
      {/* Loading text */}
      {loading ? (
        <div className="text-center py-4 text-neutral-medium">
          Loading rooms...
        </div>
      ) : (
        <div
          id="room-selector-grid"
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
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
                      onClick={() => onRoomSelect(room.id)}
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
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
