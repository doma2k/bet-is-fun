import { useState } from "react";

export default function GlowButton({
  name,
  systemPower,
}: {
  name: string;
  systemPower: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="relative">
      <button
        className={`
            relative px-2 py-2 
            bg-gray-900 border-2 
            font-mono font-bold text-md
            uppercase 
            transition-all duration-150
            active:scale-95
            ${
              systemPower
                ? `border-green-500 text-green-400
                   shadow-[0_0_20px_rgba(34,197,94,0.3)]
                   hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]
                   hover:text-green-300
                   hover:border-green-400
                   ${isPressed ? "bg-green-500/10" : ""}`
                : `border-gray-600 text-gray-500
                   shadow-none
                   hover:shadow-none
                   cursor-not-allowed`
            }
          `}
        onMouseDown={() => systemPower && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={!systemPower}
      >
        {/* Button text */}
        <span className={`relative z-10 ${
          systemPower 
            ? "drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" 
            : "drop-shadow-none"
        }`}>
          {name}
        </span>

        {/* Corner details */}
        <div className={`absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 ${
          systemPower ? "border-green-500" : "border-gray-600"
        }`}></div>
        <div className={`absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 ${
          systemPower ? "border-green-500" : "border-gray-600"
        }`}></div>
        <div className={`absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 ${
          systemPower ? "border-green-500" : "border-gray-600"
        }`}></div>
        <div className={`absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 ${
          systemPower ? "border-green-500" : "border-gray-600"
        }`}></div>
      </button>
    </div>
  );
}