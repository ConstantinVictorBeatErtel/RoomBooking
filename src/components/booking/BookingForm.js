import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../ui';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const BookingForm = ({
  status, 
  onSubmit,
  name,
  onNameChange,
  email,
  onEmailChange,
  bookingMessage,
  selectionDetails,
}) => {
  // GUARD to prevent rendering "null"
  if (!selectionDetails) {
    return null;
  }

  // Conditionally render based on the status from the parent
  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <DotLottieReact
          src="https://lottie.host/83312082-d11e-47ce-b166-6643d4aeb0fb/OgnDWNbOvX.lottie"
          loop
          autoplay
          style={{ height: '200px', width: '200px' }}
        />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Booking Confirmed!
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg font-semibold text-gray-700">
          Confirming your booking...
        </p>
      </div>
    );
  }

  // Combine date and time to create a full ISO-compatible string
  const fullStartTimeString = `${selectionDetails.date}T${selectionDetails.startTime}`;
  const fullEndTimeString = `${selectionDetails.date}T${selectionDetails.endTime}`;

  // Now parse the complete string
  const formattedStartTime = format(parseISO(fullStartTimeString), 'p');
  const formattedEndTime = format(parseISO(fullEndTimeString), 'p');
  const formattedDate = format(parseISO(fullStartTimeString), 'EEEE, MMMM d');

  return (
    <div>
      <>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {/* <User className="mr-3 h-6 w-6" /> */}
          Your Details
        </h2>

        {/* Booking display */}
        <div className="mb-6 p-4 rounded-lg border bg-gray-50 space-y-2">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 mr-3 text-gray-500" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="h-5 w-5 mr-3 text-gray-500" />
            <span className="font-medium">
              {formattedStartTime} – {formattedEndTime}
            </span>
          </div>
        </div>

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
            variant="primary"
            className="w-full py-3 text-lg"
          >
            Confirm Booking
          </Button>

          {bookingMessage && (
            <div
              className={clsx(
                'mt-4 p-4 rounded-md flex items-center border',
                {
                  'bg-neutral-lightest border-brand-blue text-brand-blue':
                      bookingMessage.includes('confirmed'),
                  'bg-red-50 border-red-300 text-red-700':
                      !bookingMessage.includes('confirmed'),
                },
              )}
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
      </>
    </div>
  );
};

export default BookingForm;
