
const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'px-4 py-3 rounded-lg font-semibold shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    // main call-to-action button
    primary: 'bg-brand-blue text-white hover:opacity-90 focus:ring-brand-blue',

    // secondary, gold button for alternative actions
    secondary:
      'bg-brand-gold text-brand-blue hover:opacity-90 focus:ring-brand-gold',

    // outline button for less prominent actions
    outline:
      'border-2 border-brand-blue bg-transparent text-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-blue',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
