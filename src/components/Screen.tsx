import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { s } from "node_modules/framer-motion/dist/types.d-CtuPurYT";

interface ScreenData {
  label: string;
  value: string;
}

interface ScreenType {
  title: string;
  data: ScreenData[];
}

const offlineScreen = {
  title: "SYSTEM OFFLINE",
  data: [
    { label: "CPU USAGE", value: "67%" },
    { label: "MEMORY", value: "4.2GB" },
    { label: "NETWORK", value: "ONLINE" },
  ],
};

export default function Screen({ systemPower }: { systemPower: boolean }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [blink, setBlink] = useState(false);
  const [screens, setScreens] = useState<ScreenType[]>([
    {
      title: "SYSTEM ONLINE",
      data: [
        { label: "CPU USAGE", value: "67%" },
        { label: "MEMORY", value: "4.2GB" },
        { label: "NETWORK", value: "ONLINE" },
      ],
    },
    {
      title: "SYSTEM ONLINE",
      data: [
        { label: "SCREEN", value: "1" },
        { label: "MEMORY", value: "4.2GB" },
        { label: "NETWORK", value: "ONLINE" },
      ],
    },
    {
      title: "SYSTEM ONLINE",
      data: [
        { label: "SCREEN", value: "2" },
        { label: "MEMORY", value: "4.2GB" },
        { label: "NETWORK", value: "ONLINE" },
      ],
    },
  ]);
  // Sample data for different screens

  const flipToNext = () => {
    setBlink(true);
    setTimeout(() => setBlink(false), 100);
    setCurrentScreen((prev) => (prev + 1) % screens.length);
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
    <div>
      <motion.div
        className="w-full max-w-md mb-8 bg-black border-4 border-gray-700 rounded-lg p-4 shadow-[inset_0_0_10px_rgba(0,255,0,0.3)] perspective-1000"
        variants={flipVariants}
        initial={false}
        animate={currentScreen !== undefined ? "complete" : "initial"}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => flipToNext()}
      >
        {" "}
        {systemPower ? (
          <div
            className={`font-mono text-green-500 relative ${
              blink ? "opacity-95" : "opacity-100"
            }`}
          >
            {/* Scan lines effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y pointer-events-none opacity-20"></div>

            {/* CRT flicker effect */}
            <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Screen header */}
                <div className="text-center text-xl font-bold mb-4 border-b border-green-800 pb-2 tracking-wider">
                  {screens[currentScreen].title}
                </div>

                {/* Screen content */}
                {screens[currentScreen].data.map((item, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-2 gap-2 text-lg mb-2 border-b border-green-800/50 pb-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="uppercase tracking-wider">{item.label}</div>
                    <div className="text-right font-bold">{item.value}</div>
                  </motion.div>
                ))}

                {/* Screen indicator */}
                <div className="flex justify-center mt-4 space-x-1">
                  {screens.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentScreen
                          ? "bg-green-500"
                          : "bg-green-800"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div
            className={`font-mono text-gray-500 relative ${
              blink ? "opacity-95" : "opacity-100"
            }`}
          >
            {/* Scan lines effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y pointer-events-none opacity-20"></div>

            {/* CRT flicker effect */}
            <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none"></div>

            <motion.div
              key={0}
              variants={flipVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Screen header */}
              <div className="text-center text-xl font-bold mb-4 border-b border-gray-800  pb-2 tracking-wider">
                {offlineScreen.title}
              </div>

              {offlineScreen.data.map((item, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-2 gap-2 text-lg mb-2 pb-2 border-b border-gray-800"
                >
                  <div className="uppercase tracking-wider">{item.label}</div>
                  <div className="text-right font-bold">{item.value}</div>
                </motion.div>
              ))}
              {/* Screen indicator */}
              <div className="flex justify-center mt-4 space-x-1">
                <div className={`w-2 h-2 rounded-full bg-gray-500`} />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
