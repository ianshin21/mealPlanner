"use client";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  colorScheme?: "sky" | "amber";
  className?: string;
}

export default function FavoriteButton({
  isFavorited,
  onToggle,
  colorScheme = "sky",
  className = "",
}: FavoriteButtonProps) {
  const activeClass =
    colorScheme === "sky" ? "text-sky-500" : "text-amber-500";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFavorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform active:scale-90 ${
        isFavorited ? activeClass : "text-gray-300"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
