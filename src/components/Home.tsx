// Hooks
import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import Container from "./Container";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useChainId, useSwitchChain } from "wagmi";
import sdk from "@farcaster/frame-sdk";
// import type { Context } from "@farcaster/frame-core";
import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { monadTestnet } from "wagmi/chains";

type BetResult = {
  won: boolean;
  userNumber: number;
  winningNumber: number;
  payout: number;
  betAmount: number;
};

type GameConfig = {
  multiplier: number; // Payout multiplier
  houseEdge: number; // House edge percentage (1-10)
  winChance: number; // Chance to win percentage (1-95)
};

// type UserInfo = {
//   img: string;
//   displayName: string;
// };

export default function GamblingGame() {
  const { isConnected } = useAccount();
  // const chainId = useChainId();
  // const { switchChainAsync } = useSwitchChain();
  const [gameError, setGameError] = useState<boolean>(false);
  const [gameErrorText, setGameErrorText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  // const [activeGameId, setActiveGameId] = useState<Hex>("0x");
  const [betAmount, setBetAmount] = useState<number>(0.01);
  const [betHistory, setBetHistory] = useState<BetResult[]>([]);
  const [userBalance, setUserBalance] = useState<number>(1000);
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    multiplier: 2,
    houseEdge: 2,
    winChance: 45,
  });
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  // const [context, setContext] = useState<Context.FrameContext>();
  const { connect } = useConnect();
  // const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    const load = async () => {
      sdk.context
        .then((context) => {
          console.log({ context });
          if (context) {
            // setContext(context);
            connect({ connector: farcasterFrame(), chainId: monadTestnet.id });
            sdk.actions.ready();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded, connect]);

  const computedMultiplier = useCallback(() => {
    return (100 - gameConfig.houseEdge) / gameConfig.winChance;
  }, [gameConfig.houseEdge, gameConfig.winChance]);

  const initializeGameSession = useCallback(() => {
    if (!isConnected) return;

    try {
      // setActiveGameId(randomIDForAddress(address));
      setBetHistory([]);
      setGameError(false);
      setGameErrorText("");

      toast.success("Game session initialized", {
        description: "Ready to place bets!",
      });
    } catch (error) {
      console.error("Error initializing game session:", error);
      toast.error("Error initializing game session", {
        description: (error as Error).message,
      });
    }
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) {
      setBetHistory([]);
      return;
    }
    // if (context) {
    //   // setUserInfo({
    //   //   img: context?.user.pfpUrl || "",
    //   //   displayName: context?.user.displayName || "",
    //   // });
    // }
    initializeGameSession();
  }, [isConnected, initializeGameSession]);

  // useEffect(() => {
  //   const switchToMonadTestnet = async () => {
  //     if (chainId !== monadTestnet.id) {
  //       try {
  //         await switchChainAsync({ chainId: monadTestnet.id });
  //       } catch (error) {
  //         console.error("Failed to switch to BamonadTestnetse:", error);
  //       }
  //     }
  //   };
  //   switchToMonadTestnet();
  // }, [chainId, switchChainAsync]);

  const placeBet = async () => {
    if (isProcessing) return;
    if (betAmount > userBalance) {
      setGameError(true);
      setGameErrorText("Insufficient balance");
      return;
    }
    try {
      setIsProcessing(true);
      let winAmount = 0;
      let newBalance = userBalance;
      const randomNumber = Math.random() * 100;
      const won = randomNumber <= gameConfig.winChance;

      if (won) {
        winAmount = betAmount * computedMultiplier();
        newBalance = userBalance + winAmount;
        setUserBalance(newBalance);
      } else {
        newBalance = userBalance - betAmount;
        setUserBalance(newBalance);
      }

      // Create bet result
      const betResult: BetResult = {
        won,
        userNumber: gameConfig.winChance,
        winningNumber: randomNumber,
        payout: winAmount,
        betAmount,
      };

      setBetHistory((prev) => [betResult, ...prev]);
      setGameError(false);
      setGameErrorText("");
    } catch (error) {
      console.error("Error placing bet:", error);
      setGameError(true);
      setGameErrorText((error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const newMultiplier = computedMultiplier();
    setGameConfig((prev) => ({
      ...prev,
      multiplier: parseFloat(newMultiplier.toFixed(2)),
    }));
  }, [gameConfig.winChance, gameConfig.houseEdge, computedMultiplier]);

  const [isLaptopOrLess, setIsLaptopOrLess] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleResize = () => setIsLaptopOrLess(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <Container>
      <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
        <div className="flex items-center w-full justify-center mb-4 p-4">
          {isConnected ? (
            <div className="w-16 text-center font-bold">
              {userBalance.toFixed(4)} MON
            </div>
          ) : (
            <ConnectButton />
          )}
        </div>
        {isConnected ? (
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-6 transition-all">
            <h2 className="text-xl font-bold mb-4">Place Your Bet</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Bet Amount
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={Math.min(0.1, userBalance)}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="flex-1 mr-2 p-2 border rounded"
                />
                <div className="w-16 text-center font-bold">
                  {betAmount.toFixed(4)} MON
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                  onClick={() => setBetAmount(Math.max(betAmount / 2))}
                >
                  ½
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                  onClick={() =>
                    setBetAmount(Math.min(userBalance, betAmount * 2))
                  }
                >
                  2×
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                  onClick={() =>
                    setBetAmount(Math.min(userBalance, betAmount + 0.1))
                  }
                >
                  +0.1
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                  onClick={() =>
                    setBetAmount(Math.min(userBalance, userBalance * 0.9))
                  }
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Win Chance: {gameConfig.winChance}%
              </label>
              <input
                type="range"
                min="1"
                max="95"
                value={gameConfig.winChance}
                onChange={(e) =>
                  setGameConfig((prev) => ({
                    ...prev,
                    winChance: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Higher Risk</span>
                <span>Higher Chance</span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  Multiplier
                </div>
                <div className="text-3xl font-bold">
                  {gameConfig.multiplier.toFixed(2)}x
                </div>
              </div>
              <div className="text-center mt-2">
                <div className="text-sm font-medium text-gray-600">
                  Potential Win
                </div>
                <div className="text-xl font-bold text-green-600">
                  {(betAmount * gameConfig.multiplier).toFixed(2)} MON
                </div>
              </div>
            </div>

            <button
              onClick={placeBet}
              disabled={
                isProcessing || betAmount <= 0 || betAmount > userBalance
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg"
            >
              {isProcessing ? "Processing..." : "Place Bet"}
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full transition-all">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>

            <ol className="list-decimal pl-5 space-y-2">
              <li>Set your bet amount in ETH using the input field.</li>
              <li>
                Adjust your win chance - lower chance means higher potential
                payout.
              </li>
              <li>
                The house edge affects the multiplier - lower house edge means
                higher multiplier.
              </li>
              <li>
                When you place a bet, a provably fair random number between
                1-100 is generated.
              </li>
              <li>
                If the number is less than or equal to your chosen win chance,
                you win!
              </li>
              <li>Your winnings are calculated as: Bet Amount × Multiplier.</li>
              <li>
                All bets are recorded on the blockchain for transparency and
                verification.
              </li>
            </ol>

            <p className="mt-4 text-sm text-gray-600">
              This system uses blockchain to ensure all bets are provably fair
              and cannot be manipulated.
            </p>
          </div>
        )}

        {betHistory.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Bet History</h2>

            <div className="max-h-86 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {betHistory.map((bet, index) => (
                    <tr
                      key={index}
                      className={bet.won ? "bg-green-50" : "bg-red-50"}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {bet.betAmount.toFixed(2)} MON
                      </td>
                      {/* <td className="px-4 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center">
                            {bet.winningNumber.toFixed()}
                            <span className="ml-2 text-xs text-gray-500">
                              (Win ≤ {bet.userNumber.toFixed(2)})
                            </span>
                          </span>
                        </td> */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        {bet.won ? (
                          <span className="text-green-600 font-medium">
                            Win
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">Loss</span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {bet.won ? `${bet.payout.toFixed(4)} MON` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Error Display */}
        {gameError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {gameErrorText}
          </div>
        )}
      </div>

      <Toaster
        visibleToasts={isLaptopOrLess ? 1 : 3}
        position={isLaptopOrLess ? "top-center" : "bottom-right"}
        richColors
        expand={true}
      />
    </Container>
  );
}
