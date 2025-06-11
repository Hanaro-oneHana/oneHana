import { PropsWithChildren } from 'react';

type Props = {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({
  className = '',
  onClick,
  type = 'button',
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      className={`primary-button ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
