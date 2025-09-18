import { Clock } from 'lucide-react';
import { Label } from '../ui';
import clsx from 'clsx';

const DurationSelector = ({ selectedDuration, onDurationChange }) => {
  const durations = [
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 3, label: '3 hours' },
  ];

  return (
    <div className="mb-6">
      <Label className="block text-base font-semibold text-neutral-dark mb-3 flex items-center">
        <Clock className="mr-2 h-5 w-5" />
        Duration
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {durations.map(duration => {
          const isSelected = selectedDuration === duration.value;
          
          return (
            <button
              key={duration.value}
              onClick={() => onDurationChange(duration.value)}
              className={clsx(
                'w-full rounded-lg border p-3 text-sm font-medium transition-colors',
                'duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue',
                {
                  'bg-brand-blue border-brand-blue text-white': isSelected,
                  'bg-white border-neutral-light text-neutral-dark hover:bg-neutral-lightest': !isSelected,
                },
              )}
            >
              {duration.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DurationSelector;
