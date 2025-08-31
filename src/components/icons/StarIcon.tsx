interface StarIconProps {
  className?: string;
}

export default function StarIcon({ className = "w-6 h-6" }: StarIconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L15.09 8.26L22 9L16.91 13.74L18.18 20.02L12 16.77L5.82 20.02L7.09 13.74L2 9L8.91 8.26L12 2Z" />
    </svg>
  );
}
