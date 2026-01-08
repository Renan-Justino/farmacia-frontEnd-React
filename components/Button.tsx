import React from 'react';

type Variant = 'primary' | 'ghost';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button: React.FC<Props> = ({ variant = 'primary', className = '', children, ...rest }) => {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost';

  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;