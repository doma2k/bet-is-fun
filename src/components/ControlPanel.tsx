"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ArcadeButton from "./ui/arcade-button";
import GlowButton from "./ui/glow-button";

export default function ControlPanel({
  currentView,
  systemPower,
}: {
  currentView: string;
  systemPower: boolean;
}) {
  const [buttonPresses, setButtonPresses] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    level: "1",
  });

  const handleButtonPress = (color: string) => {
    setButtonPresses((prev) => [...prev, color]);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const flipVariants = {
    initial: { rotateY: 0 },
    flip: { rotateY: 180 },
    complete: { rotateY: 360 },
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.3, duration: 0.4 },
    },
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center p-4">
      <motion.div
        className="bg-black/50 p-8 rounded-xl border-2 border-gray-800 shadow-xl"
        variants={flipVariants}
        animate="complete"
        initial={false}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="wait">
          {currentView === "buttons" ? (
            <motion.div
              key="buttons"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center space-y-6"
            >
              {/* Button Interface */}
              <div className="flex flex-wrap gap-8 justify-center">
                <ArcadeButton
                  color="red"
                  onClick={() => handleButtonPress("Red")}
                />
                <ArcadeButton
                  color="green"
                  onClick={() => handleButtonPress("Green")}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inputs"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center space-y-6"
            >
              {/* Input Interface */}
              <div className="flex flex-wrap gap-8 justify-center">
                <GlowButton name={"DEPOSIT"} systemPower={systemPower} />
                <GlowButton name={"WITHDRAW"} systemPower={systemPower} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Display */}
      {/* <div className="mt-8 p-4 bg-black border-2 border-[#3a3c2e] rounded-lg shadow-[inset_0_0_10px_rgba(0,255,0,0.3)] max-w-md w-full">
        <div className="font-mono text-green-500 text-sm">
          <div className="text-center text-base font-bold mb-2 border-b border-green-800 pb-2">
            SYSTEM STATUS
          </div>
          <div className="space-y-1">
            <div>MODE: {currentView.toUpperCase()}</div>
            <div>COMMANDS: {buttonPresses.length}</div>
            <div>USER: {formData.username || "UNKNOWN"}</div>
            <div>LEVEL: {formData.level}</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
