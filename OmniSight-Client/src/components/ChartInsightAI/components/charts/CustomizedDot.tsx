
import React from 'react';

interface CustomizedDotProps {
  cx: number;
  cy: number;
  payload: any;
  index: number;
  onClick: (pointId: string) => void;
  selected: boolean;
  isHovered: boolean;
}

const CustomizedDot: React.FC<CustomizedDotProps> = ({ 
  cx, 
  cy, 
  payload, 
  onClick, 
  selected, 
  isHovered 
}) => {
  if (selected || isHovered) {
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={selected ? 8 : 6}
        fill={selected ? '#3b82f6' : '#64748b'} 
        stroke="white"
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(payload.id)}
      />
    );
  }
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4}
      fill="#3b82f6" 
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(payload.id)}
    />
  );
};

export default CustomizedDot;
