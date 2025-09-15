import React, { useState } from 'react';

const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray[0];
  const content = childrenArray[1];

  const triggerChild =
    trigger && trigger.props && trigger.props.children
      ? trigger.props.children
      : trigger;

  const handleToggle = () => setIsOpen(prev => !prev);

  const clonedTrigger = React.isValidElement(triggerChild)
    ? React.cloneElement(triggerChild, {
      onClick: handleToggle,
    })
    : triggerChild;

  return (
    <div className="relative inline-block">
      {clonedTrigger}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2">
            {content && content.props && content.props.children
              ? content.props.children
              : content}
          </div>
        </>
      )}
    </div>
  );
};

const PopoverTrigger = ({ _asChild, children, ...props }) => {
  return React.isValidElement(children)
    ? React.cloneElement(children, props)
    : children;
};

const PopoverContent = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };
