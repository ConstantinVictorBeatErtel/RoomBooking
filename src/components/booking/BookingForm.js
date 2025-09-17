import { User, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../ui';

const BookingForm = ({
  name,
  onNameChange,
  email,
  onEmailChange,
  onSubmit,
  bookingMessage,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
        <User className="mr-2 h-6 w-6" />
        Your Details
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="Enter your Berkeley email (someone@berkeley.edu)"
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
              bookingMessage.includes('confirmed')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {bookingMessage.includes('confirmed') ? (
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
