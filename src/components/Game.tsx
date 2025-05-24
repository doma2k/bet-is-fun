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
import ControlPanel from "./ControlPanel";
import Screen from "./Screen";
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
  currentView,
}: {
  children: React.ReactNode;
  systemPower: boolean;
  currentView: string;
}) {
  // const [lastPressed, setLastPressed] = useState<string | null>(null);
  // const [prizePool, setPrizePool] = useState(1000);
  // const [winChance, setWinChance] = useState(25);
  // const [playerBalance, setPlayerBalance] = useState(500);
  // const [blink, setBlink] = useState(false);
  // const [bet, setBet] = useState(10);
  //   const [won, setWon] = useState(0);

  // const handleButtonPress = (buttonName: string) => {
  //   console.log(systemPower);
  //   if (!systemPower) return;

  //   setLastPressed(buttonName);

  //   setWinChance((prev) => {
  //     const newChance =
  //       prev + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5;
  //     return Math.min(Math.max(newChance, 5), 45); // Keep between 5% and 45%
  //   });

  //   setBet((prev) => {
  //     let newValue;

  //     if (lastPressed == "Red") {
  //       newValue = prev + Math.floor(Math.random() * 10) + 1;
  //     } else if (lastPressed == "Blue") {
  //       newValue = Math.max(0, prev - Math.floor(Math.random() * 5) + 1);
  //     } else if (lastPressed == "Green") {
  //       newValue = prev * (Math.random() * 2 + 1);
  //     } else {
  //       newValue = prev / (Math.random() * 2 + 1);
  //     }

  //     return Math.max(0, newValue);
  //   });

  //   // Check for win and update balance
  //   if (Math.random() * 100 < winChance) {
  //     const winAmount = bet;
  //     setPrizePool((prev) => prev - winAmount);
  //     setPlayerBalance((prev) => prev + winAmount);
  //   } else {
  //     setPrizePool((prev) => prev + bet);
  //     setPlayerBalance((prev) => Math.max(prev - 10, 0)); // Deduct 10, but don't go below 0
  //   }
  // };

  return (
    <div className="w-full max-w-md h-screen sm:h-auto bg-black shadow-lg rounded-md p-2 transition-all">
      <div className="flex flex-col bg-gray-900 h-full justify-between p-4">
        <Screen systemPower={systemPower} />
        <div className="mb-12">
          <div className="pt-4 text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-extrabold text-yellow-400 drop-shadow-[4px_4px_0px_rgba(255,0,0,1)] md:drop-shadow-[8px_8px_0px_rgba(255,0,0,1)] uppercase tracking-wider transform rotate-[-2deg]">
              Bet!
            </h1>
            <h3 className="text-2xl md:text-4xl font-extrabold text-purple-600 drop-shadow-[1px_1px_0px_rgba(255,0,0,1)] md:drop-shadow-[2px_2px_0px_rgba(255,0,0,1)] tracking-wider transform rotate-[-2deg]">
              on MONAD
            </h3>
          </div >
          {children}
          <ControlPanel currentView={currentView} systemPower={systemPower} />
        </div>
      </div>
    </div>
  );
}
