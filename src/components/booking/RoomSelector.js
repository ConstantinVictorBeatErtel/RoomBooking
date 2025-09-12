import React from "react";
import { Button, Label } from "../ui";

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect, loading }) => {
  return (
    <div className="mb-6">
      <Label className="mb-3 block">Room</Label>
      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading rooms...</div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-6">
          {rooms.map((room) => (
            <Button
              key={room.id}
              variant={selectedRoom === room.id ? "default" : "outline"}
              onClick={() => onRoomSelect(room.id)}
              className="flex-shrink-0 whitespace-nowrap px-6"
            >
              {room.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
