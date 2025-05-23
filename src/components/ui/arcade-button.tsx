"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArcadeButtonProps {
  color?: "red" | "blue" | "green" | "yellow" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  className?: string;
  label?: string;
}

export default function ArcadeButton({
  color = "red",
  size = "lg",
  onClick,
  className,
  label,
}: ArcadeButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Map colors to Tailwind classes
  const colorMap = {
    red: "bg-red-500 shadow-red-700",
    blue: "bg-blue-500 shadow-blue-700",
    green: "bg-green-500 shadow-green-700",
    yellow: "bg-yellow-500 shadow-yellow-700",
    white: "bg-white shadow-gray-400",
  };

  // Map sizes to dimensions
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const handlePress = () => {
    setIsPressed(true);
    onClick?.();

    // // Play sound effect (optional)
    // const audio = new Audio("/click.mp3");
    // audio.volume = 0.5;
    // audio.play().catch(() => {
    //   // Ignore errors if audio can't play
    // });

    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Button base/shadow */}
      <div
        className={cn(
          "rounded-full",
          sizeMap[size],
          "bg-black/20",
          "translate-y-2"
        )}
      />

      {/* Button body */}
      <motion.button
        className={cn(
          "absolute top-0 rounded-full",
          sizeMap[size],
          colorMap[color],
          "flex items-center justify-center",
          "cursor-pointer select-none",
          "border-4 border-t-white/20 border-l-white/20 border-r-black/20 border-b-black/20",
          "shadow-[inset_0_-8px_8px_rgba(0,0,0,0.2),inset_0_8px_8px_rgba(255,255,255,0.2)]",
          className
        )}
        animate={{
          y: isPressed ? 6 : 0,
          boxShadow: isPressed
            ? "0 0 0 rgba(0,0,0,0.2)"
            : "0 6px 0 rgba(0,0,0,0.4)",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        onClick={handlePress}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handlePress();
          }
        }}
        tabIndex={0}
        aria-label={label || "Arcade button"}
      >
        {/* Glossy highlight effect */}
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[30%] bg-white/30 rounded-full transform rotate-[-20deg]" />
      </motion.button>

      {label && (
        <span className="mt-4 text-sm font-bold uppercase">{label}</span>
      )}
    </div>
  );
}
