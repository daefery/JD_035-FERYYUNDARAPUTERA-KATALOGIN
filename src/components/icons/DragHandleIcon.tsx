import React from "react";

interface DragHandleIconProps {
  className?: string;
  size?: number;
}

const DragHandleIcon: React.FC<DragHandleIconProps> = ({
  className = "w-6 h-6",
  size,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8h16M4 16h16"
      />
    </svg>
  );
};

export default DragHandleIcon;
