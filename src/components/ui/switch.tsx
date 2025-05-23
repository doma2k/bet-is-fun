import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalogSwitchProps {
  initialState?: boolean;
  onToggle?: (isOn: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  conformation?: boolean;
}

export default function AnalogSwitch({
  initialState,
  onToggle,
  label,
  size = "md",
  className,
  disabled = false,
}: AnalogSwitchProps) {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    if (disabled) return;

    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState);

    // // Add click sound effect
    // const audio = new Audio("/switch-click.mp3");
    // audio.volume = 0.3;
    // audio.play().catch(() => {
    //   // Ignore errors if audio can't play
    // });
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      track: "w-8 h-4",
      toggle: "w-3 h-3",
      translateX: "12px",
      text: "text-xs",
    },
    md: {
      track: "w-12 h-6",
      toggle: "w-4 h-4",
      translateX: "20px",
      text: "text-sm",
    },
    lg: {
      track: "w-16 h-8",
      toggle: "w-6 h-6",
      translateX: "28px",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label && (
        <span
          className={cn(
            "font-mono text-[#ffb300] uppercase tracking-wider",
            config.text
          )}
        >
          {label}
        </span>
      )}

      <div className="relative">
        {/* Switch housing/track */}
        <motion.div
          className={cn(
            "relative cursor-pointer border-2 border-[#3a3c2e] rounded-sm",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]",
            config.track,
            disabled ? "opacity-50 cursor-not-allowed" : "",
            isOn ? "bg-[#2d4a2d]" : "bg-[#1a1a1a]"
          )}
          onClick={handleToggle}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          {/* Track grooves */}
          <div className="absolute inset-1 border border-black/30 rounded-sm" />

          {/* ON/OFF indicators */}
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[8px] font-bold text-green-400 opacity-60">
            ON
          </div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[8px] font-bold text-red-400 opacity-60">
            OFF
          </div>

          {/* Toggle slider */}
          <motion.div
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2",
              "bg-gradient-to-b from-gray-300 to-gray-600",
              "border border-gray-800 rounded-sm",
              "shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
              config.toggle
            )}
            animate={{
              x: isOn ? config.translateX : "2px",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {/* Toggle highlight */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20 rounded-sm" />

            {/* Toggle grip lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-2/3 bg-black/30" />
            </div>
          </motion.div>
        </motion.div>

        {/* Status LED */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-black">
          <motion.div
            className={cn(
              "w-full h-full rounded-full",
              isOn
                ? "bg-green-400 shadow-[0_0_4px_rgba(34,197,94,0.8)]"
                : "bg-red-600"
            )}
            animate={{
              opacity: isOn ? [1, 0.6, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isOn ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* State text */}
      <span
        className={cn(
          "font-mono font-bold",
          config.text,
          isOn ? "text-green-400" : "text-red-400"
        )}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </div>
  );
}
