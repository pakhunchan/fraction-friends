"use client";

interface CookieProps {
  size?: number;
  isHalf?: boolean;
  halfSide?: "left" | "right";
  isQuarter?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Cookie({
  size = 120,
  isHalf = false,
  halfSide = "left",
  isQuarter = false,
  onClick,
  selected = false,
  disabled = false,
}: CookieProps) {
  const baseColor = "#d4894e";
  const darkColor = "#8b5e34";
  const chipColor = "#4a3520";

  // For quarter cookies, show a quarter circle
  if (isQuarter) {
    const qSize = size * 0.6;
    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`cookie-drop transition-transform ${
          selected ? "ring-4 ring-blue-400 scale-110" : ""
        } ${!disabled && onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${
          disabled ? "opacity-80" : ""
        }`}
        style={{ width: qSize, height: qSize }}
      >
        <svg width={qSize} height={qSize} viewBox="0 0 60 60">
          <path
            d="M 30 30 L 30 0 A 30 30 0 0 1 60 30 Z"
            fill={baseColor}
            stroke={darkColor}
            strokeWidth="2"
          />
          <circle cx="42" cy="15" r="3" fill={chipColor} />
          <circle cx="48" cy="24" r="2.5" fill={chipColor} />
        </svg>
      </button>
    );
  }

  if (isHalf) {
    const hWidth = size * 0.45;
    const hHeight = size * 0.8;
    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`cookie-drop transition-transform ${
          selected ? "ring-4 ring-blue-400 scale-110" : ""
        } ${!disabled && onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${
          disabled ? "opacity-80" : ""
        }`}
        style={{ width: hWidth, height: hHeight }}
      >
        <svg width={hWidth} height={hHeight} viewBox={halfSide === "left" ? "0 0 50 100" : "50 0 50 100"}>
          {halfSide === "left" ? (
            <>
              <path
                d="M 50 5 A 45 45 0 0 0 50 95 L 50 5"
                fill={baseColor}
                stroke={darkColor}
                strokeWidth="2.5"
              />
              <circle cx="25" cy="30" r="4" fill={chipColor} />
              <circle cx="35" cy="55" r="3.5" fill={chipColor} />
              <circle cx="20" cy="70" r="4.5" fill={chipColor} />
            </>
          ) : (
            <>
              <path
                d="M 50 5 A 45 45 0 0 1 50 95 L 50 5"
                fill={baseColor}
                stroke={darkColor}
                strokeWidth="2.5"
              />
              <circle cx="75" cy="30" r="4" fill={chipColor} />
              <circle cx="65" cy="55" r="3.5" fill={chipColor} />
              <circle cx="80" cy="70" r="4.5" fill={chipColor} />
            </>
          )}
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`cookie-drop transition-transform ${
        selected ? "ring-4 ring-blue-400 rounded-full scale-110" : ""
      } ${!disabled && onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${
        disabled ? "opacity-80" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill={baseColor} stroke={darkColor} strokeWidth="3" />
        {/* Chocolate chips */}
        <circle cx="30" cy="35" r="5" fill={chipColor} />
        <circle cx="55" cy="25" r="4.5" fill={chipColor} />
        <circle cx="70" cy="40" r="5.5" fill={chipColor} />
        <circle cx="35" cy="60" r="4" fill={chipColor} />
        <circle cx="60" cy="60" r="5" fill={chipColor} />
        <circle cx="45" cy="75" r="4.5" fill={chipColor} />
        <circle cx="70" cy="70" r="4" fill={chipColor} />
        {/* Slice line indicator when selected */}
        {selected && (
          <line x1="50" y1="4" x2="50" y2="96" stroke="white" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
        )}
      </svg>
    </button>
  );
}

// Sliced cookie: shows two halves with a gap
export function SlicedCookie({ size = 120, onClickLeft, onClickRight, leftGone, rightGone }: { size?: number; onClickLeft?: () => void; onClickRight?: () => void; leftGone?: boolean; rightGone?: boolean }) {
  return (
    <div className="flex items-center gap-1 cookie-slice">
      {!leftGone && <Cookie size={size} isHalf halfSide="left" onClick={onClickLeft} />}
      {!rightGone && <Cookie size={size} isHalf halfSide="right" onClick={onClickRight} />}
    </div>
  );
}
