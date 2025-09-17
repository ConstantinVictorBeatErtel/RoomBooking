import { User, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../ui';
import clsx from 'clsx';

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
      <h2 className="text-2xl font-semibold mb-6 text-neutral-dark flex items-center">
        <User className="mr-3 h-6 w-6" />
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

        <Button type="submit" variant="primary" className="w-full py-3 text-lg">
          Confirm Booking
        </Button>

        {bookingMessage && (
          <div
            className={clsx('mt-4 p-4 rounded-md flex items-center border', {
              'bg-neutral-lightest border-brand-blue text-brand-blue':
                bookingMessage.includes('confirmed'),
              'bg-red-50 border-red-300 text-red-700':
                !bookingMessage.includes('confirmed'),
            })}
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
