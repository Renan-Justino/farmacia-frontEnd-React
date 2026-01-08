import React from 'react';

const Container: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`container mx-auto ${className}`}>{children}</div>
);

export default Container;