import { type CSSProperties, forwardRef, type ReactNode } from 'react';

interface StampProps {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}

export const Stamp = forwardRef<HTMLDivElement, StampProps>(function Stamp({ children, color, style }, ref) {
  return (
    <div className="stamp" ref={ref} style={{ color, ...style }}>
      {children}
    </div>
  );
});
