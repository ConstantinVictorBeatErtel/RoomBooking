import { useState, useEffect, useRef } from 'react';
import { Button, Label } from '../ui';
import { Info } from 'lucide-react';

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect, loading }) => {
  const [showInfo, setShowInfo] = useState(null);
  const containerRef = useRef(null);

  // Close info card when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowInfo(null);
      }
    };

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showInfo]);
  return (
    <div className="mb-6">
      <Label className="mb-3 block">Room</Label>
      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading rooms...</div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {rooms.map((room, index) => (
            <div key={room.id} className="relative">
              <Button
                variant={selectedRoom === room.id ? 'default' : 'outline'}
                onClick={() => onRoomSelect(room.id)}
                className="w-full p-4 h-auto text-left hover:shadow-md transition-shadow"
              >
                <div className="font-semibold pr-8">{room.name}</div>
              </Button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowInfo(showInfo === room.id ? null : room.id);
                }}
                className={`absolute top-2 right-2 p-1 h-6 w-6 rounded-full transition-colors ${
                  showInfo === room.id 
                    ? 'bg-blue-600 text-white' 
                    : selectedRoom === room.id 
                      ? 'text-white hover:bg-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Info size={14} />
              </button>
              {showInfo === room.id && (
                <div 
                  className={`absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 text-sm ${
                    index % 3 === 2 ? 'top-10 right-0' : 'top-10 left-0'
                  }`}
                >
                  <div className="font-medium mb-2">{room.name}</div>
                  {room.description && (
                    <div className="text-gray-600 mb-2">
                      {room.description}
                    </div>
                  )}
                  {room.capacity && (
                    <div className="text-gray-500">
                      Capacity: {room.capacity}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
