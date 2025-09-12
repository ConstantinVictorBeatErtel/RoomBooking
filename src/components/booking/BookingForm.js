import React from "react";
import { User, CheckCircle, AlertCircle } from "lucide-react";
import { Button, Input, Label } from "../ui";

const BookingForm = ({
  people,
  selectedPersonId,
  onPersonSelect,
  email,
  onEmailChange,
  onSubmit,
  bookingMessage,
  loading,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
        <User className="mr-2 h-6 w-6" />
        Your Details
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <Label className="mb-2">Person</Label>
          {loading ? (
            <div className="text-sm text-gray-500">Loading people...</div>
          ) : (
            <select
              value={selectedPersonId}
              onChange={onPersonSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="Select a person to auto-fill email"
          readOnly
          disabled={!selectedPersonId}
          className={
            !selectedPersonId ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
          }
          required
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
        >
          Confirm Booking
        </Button>

        {bookingMessage && (
          <div
            className={`mt-4 p-4 rounded-md flex items-center ${
              bookingMessage.includes("confirmed")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {bookingMessage.includes("confirmed") ? (
              <CheckCircle className="mr-2 h-5 w-5" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5" />
            )}
            <span className="font-medium">{bookingMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
