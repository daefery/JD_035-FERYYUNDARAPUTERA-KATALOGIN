import React from "react";

interface DotsVerticalIconProps {
  className?: string;
  size?: number;
}

const DotsVerticalIcon: React.FC<DotsVerticalIconProps> = ({
  className = "w-6 h-6",
  size,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
};

export default DotsVerticalIcon;
