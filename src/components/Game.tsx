// const initializeGameSession = useCallback(async () => {
//   if (!isConnected) return;

//   try {
//     setBetHistory([]);
//     setGameError(false);
//     setGameErrorText("");
//     if (poolBalHook) {
//       setSetPool(poolBalHook);
//     }
//     // if (userBalHook) {
//     //   setUserBalance(userBalHook);
//     // }

//     toast.success("Game session initialized", {
//       description: "Ready to place bets!",
//     });
//   } catch (error) {
//     console.error("Error initializing game session:", error);
//     toast.error("Error initializing game session", {
//       description: (error as Error).message,
//     });
//   }
// }, [isConnected, poolBalHook, userBalHook]);

// const computedMultiplier = useCallback(() => {
//   return (100 - gameConfig.houseEdge) / gameConfig.winChance;
// }, [gameConfig.houseEdge, gameConfig.winChance]);

// const placeBet = async () => {
//   if (isProcessing) return;
//   if (betAmount > userBalance) {
//     setGameError(true);
//     setGameErrorText("Insufficient balance");
//     return;
//   }
//   try {
//     setIsProcessing(true);

//     let winAmount = 0;
//     let newBalance = userBalance;
//     const randomNumber = Math.random() * 100;
//     const won = randomNumber <= gameConfig.winChance;

//     if (won) {
//       winAmount = betAmount * computedMultiplier();
//       newBalance = userBalance + winAmount;
//       setUserBalance(newBalance);
//     } else {
//       newBalance = userBalance - betAmount;
//       setUserBalance(newBalance);
//     }

//     // Create bet result
//     const betResult: BetResult = {
//       won,
//       userNumber: gameConfig.winChance,
//       winningNumber: randomNumber,
//       payout: winAmount,
//       betAmount,
//     };

//     setBetHistory((prev) => [betResult, ...prev]);
//     setGameError(false);
//     setGameErrorText("");
//   } catch (error) {
//     console.error("Error placing bet:", error);
//     setGameError(true);
//     setGameErrorText((error as Error).message);
//   } finally {
//     setIsProcessing(false);
//   }
// };
import { useState, useEffect } from "react";
import ArcadeButton from "./ui/arcade-button";
// type BetResult = {
//   won: boolean;
//   userNumber: number;
//   winningNumber: number;
//   payout: number;
//   betAmount: number;
// };

export default function Game({
  children,
  systemPower,
}: {
  children: React.ReactNode;
  systemPower: boolean;
}) {
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const [prizePool, setPrizePool] = useState(1000);
  const [winChance, setWinChance] = useState(25);
  const [playerBalance, setPlayerBalance] = useState(500);
  const [blink, setBlink] = useState(false);
  const [bet, setBet] = useState(10);
  //   const [won, setWon] = useState(0);

  const handleButtonPress = (buttonName: string) => {
    console.log(systemPower);
    if (!systemPower) return;

    setLastPressed(buttonName);

    setWinChance((prev) => {
      const newChance =
        prev + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5;
      return Math.min(Math.max(newChance, 5), 45); // Keep between 5% and 45%
    });

    setBet((prev) => {
      let newValue;

      if (lastPressed == "Red") {
        newValue = prev + Math.floor(Math.random() * 10) + 1;
      } else if (lastPressed == "Blue") {
        newValue = Math.max(0, prev - Math.floor(Math.random() * 5) + 1);
      } else if (lastPressed == "Green") {
        newValue = prev * (Math.random() * 2 + 1);
      } else {
        newValue = prev / (Math.random() * 2 + 1);
      }

      return Math.max(0, newValue);
    });

    // Check for win and update balance
    if (Math.random() * 100 < winChance) {
      const winAmount = bet;
      setPrizePool((prev) => prev - winAmount);
      setPlayerBalance((prev) => prev + winAmount);
    } else {
      setPrizePool((prev) => prev + bet);
      setPlayerBalance((prev) => Math.max(prev - 10, 0)); // Deduct 10, but don't go below 0
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md bg-black shadow-lg rounded-lg p-6 mb-6 transition-all">
      <div className=" bg-gray-900">
        <div className="pt-4 text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-extrabold text-yellow-400 drop-shadow-[4px_4px_0px_rgba(255,0,0,1)] md:drop-shadow-[8px_8px_0px_rgba(255,0,0,1)] uppercase tracking-wider transform rotate-[-2deg]">
            Bet!
          </h1>
          <h3 className="text-2xl md:text-4xl font-extrabold text-purple-600 drop-shadow-[1px_1px_0px_rgba(255,0,0,1)] md:drop-shadow-[2px_2px_0px_rgba(255,0,0,1)] tracking-wider transform rotate-[-2deg]">
            on MONAD
          </h3>
        </div>
        {children}
        {systemPower ? (
          <div className="w-full max-w-md mb-8 bg-black border-4 border-gray-700 rounded-lg p-4 shadow-[inset_0_0_10px_rgba(0,255,0,0.3)]">
            <div
              className={`font-mono text-green-500 ${
                blink ? "opacity-95" : "opacity-100"
              }`}
            >
              {/* Scan lines effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y bg-size-100-4 pointer-events-none opacity-20"></div>

              {/* Screen content */}
              <div className="grid grid-cols-2 gap-2 text-lg mb-2 border-b border-green-800 pb-2">
                <div className="uppercase tracking-wider">PRIZE POOL</div>
                <div className="text-right font-bold">
                  ${prizePool.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-lg mb-2 border-b border-green-800 pb-2">
                <div className="uppercase tracking-wider">WIN CHANCE</div>
                <div className="text-right font-bold">
                  {winChance.toFixed(1)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-lg">
                <div className="uppercase tracking-wider">PLAYER BALANCE</div>
                <div className="text-right font-bold">
                  ${playerBalance.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mb-8 h-32 bg-black border-4 border-gray-800 rounded-sm flex items-center justify-center">
            <span className="text-gray-600 font-mono text-lg">
              SYSTEM OFFLINE
            </span>
          </div>
        )}
      </div>

      <div className="min-h-screen bg-gray-900 flex flex-col items-center  p-4">
        <div className="bg-black/50 p-8 rounded-xl border-2 border-gray-800 shadow-xl">
          <div className="flex flex-wrap gap-8 justify-center">
            <ArcadeButton
              color="red"
              onClick={() => handleButtonPress("Red")}
              label="Punch"
            />
            <ArcadeButton
              color="blue"
              onClick={() => handleButtonPress("Blue")}
              label="Kick"
            />
            <ArcadeButton
              color="green"
              onClick={() => handleButtonPress("Green")}
              label="Block"
            />
            <ArcadeButton
              color="yellow"
              onClick={() => handleButtonPress("Yellow")}
              label="Special"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
