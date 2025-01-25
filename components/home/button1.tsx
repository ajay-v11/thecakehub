import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button1: React.FC<ButtonProps> = ({children, className, ...props}) => {
  return (
    <button
      className={`bg-purple-700 text-white font-base text-md md:font-semibold md:text-xl rounded-lg h-10 md:h-12 px-4 hover:bg-purple-500 hover:scale-95 transition-all duration-300 ${className}`}
      {...props}>
      {children}
    </button>
  );
};

export default Button1;
