// import { Button } from "@/components/ui/button";
// import { GAME_CONTRACT_ADDRESS } from "@/utils/constants";
// import { post } from "@/utils/fetch";
// import { usePrivy, useWallets } from "@privy-io/react-auth";
// import { ExternalLink } from "lucide-react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { toast } from "sonner";
// import { waitForTransactionReceipt } from "viem/actions";
// import { diceAbi } from "./abi";

// import {
//   createWalletClient,
//   custom,
//   encodeFunctionData,
//   formatEther,
//   Hex,
//   parseGwei,
// } from "viem";

// export function useTransactions() {
//   // User and Wallet objects.
//   const { user } = usePrivy();
//   const { ready, wallets } = useWallets();
//   const [houseEdgePercent, setHouseEdgePercent] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   // Fetch user nonce on new login.
//   const userNonce = useRef(0);
//   const userBalance = useRef(0n);
//   const userAddress = useRef("");

//   // Resets nonce and balance
//   const resetNonceAndBalance = useCallback(async () => {
//     if (!user) {
//       return;
//     }
//     const [privyUser] = user.linkedAccounts.filter(
//       (account) =>
//         account.type === "wallet" && account.walletClientType === "privy"
//     );
//     if (!privyUser || !(privyUser as any).address) {
//       return;
//     }
//     const privyUserAddress = (privyUser as any).address;

//     const nonce = await publicClient.getTransactionCount({
//       address: privyUserAddress as Hex,
//     });
//     const balance = await publicClient.getBalance({
//       address: privyUserAddress as Hex,
//     });

//     console.log("Setting nonce: ", nonce);
//     console.log("Setting balance: ", balance.toString());

//     userNonce.current = nonce;
//     userBalance.current = balance;
//     userAddress.current = privyUserAddress;
//   }, [user]);

//   useEffect(() => {
//     resetNonceAndBalance();
//   }, [resetNonceAndBalance]);

//   // Fetch provider on new login.
//   const walletClient = useRef<any>(null);
//   useEffect(() => {
//     async function getWalletClient() {
//       if (!ready || !wallets) return;

//       const userWallet = wallets.find((w) => w.walletClientType == "privy");
//       if (!userWallet) return;

//       const ethereumProvider = await userWallet.getEthereumProvider();
//       const provider = createWalletClient({
//         chain: monadTestnet,
//         transport: custom(ethereumProvider),
//       });

//       console.log("Setting provider: ", provider);
//       walletClient.current = provider;
//     }

//     getWalletClient();
//   }, [user, ready, wallets]);

//   // Fetch contract information on mount
//   useEffect(() => {
//     async function fetchGameInfo() {
//       try {
//         const houseEdge = await publicClient.readContract({
//           address: GAME_CONTRACT_ADDRESS,
//           abi: diceAbi,
//           functionName: "houseEdge",
//         });
//         setHouseEdgePercent(Number(houseEdge) / 100);
//       } catch (error) {
//         console.error("Error fetching game information:", error);
//         toast.error("Failed to load game information");
//       }
//     }

//     fetchGameInfo();
//   }, []);

//   // Sends a transaction and wait for receipt.
//   async function sendRawTransactionAndConfirm({
//     successText,
//     gas,
//     data,
//     nonce,
//     value = 0n,
//     maxFeePerGas = parseGwei("50"),
//     maxPriorityFeePerGas = parseGwei("5"),
//   }: {
//     successText?: string;
//     gas: bigint;
//     data: Hex;
//     nonce: number;
//     value?: bigint;
//     maxFeePerGas?: bigint;
//     maxPriorityFeePerGas?: bigint;
//   }) {
//     let e: Error | null = null;

//     try {
//       // Sign and send transaction.
//       const provider = walletClient.current;
//       if (!provider) {
//         throw Error("Wallet not found.");
//       }
//       const privyUserAddress = userAddress.current;
//       if (!privyUserAddress) {
//         throw Error("Privy user not found.");
//       }

//       const startTime = Date.now();
//       const signedTransaction = await provider.signTransaction({
//         to: GAME_CONTRACT_ADDRESS,
//         account: privyUserAddress,
//         data,
//         nonce,
//         gas,
//         value,
//         maxFeePerGas,
//         maxPriorityFeePerGas,
//       });

//       // const environment = import.meta.env.VITE_APP_ENVIRONMENT;
//       const rpc = "http://localhost:8545";
//       // environment === "prod"
//       //   ? import.meta.env.VITE_MONAD_RPC_URL! ||
//       //     monadTestnet.rpcUrls.default.http[0]
//       //   : monadTestnet.rpcUrls.default.http[0];
//       const response = await post({
//         url: rpc,
//         params: {
//           id: 0,
//           jsonrpc: "2.0",
//           method: "eth_sendRawTransaction",
//           params: [signedTransaction],
//         },
//       });
//       const time = Date.now() - startTime;

//       if (response.error) {
//         console.log(`Failed sent in ${time} ms`);
//         throw Error(response.error.message);
//       }

//       const transactionHash: Hex = response.result;

//       // Fire toast info with benchmark and transaction hash.
//       console.log(`Transaction sent in ${time} ms: ${response.result}`);
//       toast.info(`Sent transaction.`, {
//         description: `${successText} Time: ${time} ms`,
//         action: (
//           <Button
//             className="outline outline-white"
//             onClick={() =>
//               window.open(
//                 `https://testnet.monadexplorer.com/tx/${transactionHash}`,
//                 "_blank",
//                 "noopener,noreferrer"
//               )
//             }
//           >
//             <div className="flex items-center gap-1 p-1">
//               <p>View</p>
//               <ExternalLink className="w-4 h-4" />
//             </div>
//           </Button>
//         ),
//       });

//       // Confirm transaction
//       const receipt = await waitForTransactionReceipt(publicClient, {
//         hash: transactionHash,
//       });

//       if (receipt.status == "reverted") {
//         console.log(`Failed confirmation in ${Date.now() - startTime} ms`);
//         throw Error(`Failed to confirm transaction: ${transactionHash}`);
//       }

//       console.log(
//         `Transaction confirmed in ${Date.now() - startTime} ms: ${
//           response.result
//         }`
//       );
//       toast.success(`Confirmed transaction.`, {
//         description: `${successText} Time: ${Date.now() - startTime} ms`,
//         action: (
//           <Button
//             className="outline outline-white"
//             onClick={() =>
//               window.open(
//                 `https://testnet.monadexplorer.com/tx/${transactionHash}`,
//                 "_blank",
//                 "noopener,noreferrer"
//               )
//             }
//           >
//             <div className="flex items-center gap-1 p-1">
//               <p>View</p>
//               <ExternalLink className="w-4 h-4" />
//             </div>
//           </Button>
//         ),
//       });

//       return receipt;
//     } catch (error) {
//       e = error as Error;

//       toast.error(`Failed to send transaction.`, {
//         description: `Error: ${e.message}`,
//       });
//       throw e;
//     }
//   }

//   // Generate a random client seed
//   function generateClientSeed() {
//     const randomBytes = new Uint8Array(16);
//     window.crypto.getRandomValues(randomBytes);
//     return Array.from(randomBytes)
//       .map((b) => b.toString(16).padStart(2, "0"))
//       .join("");
//   }

//   // Place a bet on the dice game
//   async function placeBet(
//     targetNumber: number,
//     betAmount: bigint,
//     clientSeed: string = generateClientSeed()
//   ) {
//     setIsLoading(true);
//     try {
//       const balance = userBalance.current;
//       if (balance < betAmount) {
//         throw Error("Insufficient balance for this bet.");
//       }

//       // Validate target number (1-100 typically for dice games)
//       if (targetNumber < 1 || targetNumber > 100) {
//         throw Error("Target number must be between 1 and 100.");
//       }

//       const nonce = userNonce.current;
//       userNonce.current = nonce + 1;
//       userBalance.current = balance - betAmount;

//       const receipt = await sendRawTransactionAndConfirm({
//         nonce,
//         successText: `Placed bet for ${formatEther(
//           betAmount
//         )} ETH on target ${targetNumber}`,
//         gas: BigInt(200_000),
//         value: betAmount,
//         data: encodeFunctionData({
//           abi: diceAbi,
//           functionName: "placeBet",
//           args: [BigInt(targetNumber), clientSeed],
//         }),
//       });

//       // Process the receipt to get bet result
//       if (receipt.logs && receipt.logs.length > 0) {
//         // You would decode the event logs here to get the BetPlaced event data
//         console.log(
//           "Bet placed successfully. Transaction hash:",
//           receipt.transactionHash
//         );
//         return receipt;
//       }
//     } catch (error) {
//       console.error("Error placing bet:", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // Verify a roll with given server seed, client seed, and nonce
//   async function verifyRoll(
//     serverSeed: string,
//     clientSeed: string,
//     nonce: number
//   ) {
//     try {
//       const result = await publicClient.readContract({
//         address: GAME_CONTRACT_ADDRESS,
//         abi: diceAbi,
//         functionName: "verifyRoll",
//         args: [serverSeed as Hex, clientSeed, BigInt(nonce)],
//       });
//       return Number(result);
//     } catch (error) {
//       console.error("Error verifying roll:", error);
//       throw error;
//     }
//   }

//   // Get current server seed hash
//   async function getHashedServerSeed() {
//     try {
//       return await publicClient.readContract({
//         address: GAME_CONTRACT_ADDRESS,
//         abi: diceAbi,
//         functionName: "hashedServerSeed",
//       });
//     } catch (error) {
//       console.error("Error getting hashed server seed:", error);
//       throw error;
//     }
//   }

//   // Get previous server seed
//   async function getPreviousServerSeed() {
//     try {
//       return await publicClient.readContract({
//         address: GAME_CONTRACT_ADDRESS,
//         abi: diceAbi,
//         functionName: "previousServerSeed",
//       });
//     } catch (error) {
//       console.error("Error getting previous server seed:", error);
//       throw error;
//     }
//   }

//   // Calculate win probability and payout for a target number
//   function calculateGameOdds(targetNumber: number) {
//     // Typical dice game: win if roll < target
//     const winProbability = targetNumber / 100;

//     // Calculate payout multiplier with house edge
//     // For example: if target is 50, fair payout would be 2x
//     // With house edge of 1%, payout becomes 1.98x
//     const fairPayout = 1 / winProbability;
//     const actualPayout = fairPayout * (1 - houseEdgePercent / 100);

//     return {
//       winProbability: winProbability,
//       payoutMultiplier: actualPayout,
//     };
//   }

//   function playNewMoveTransaction() {
//     console.log("playNewMoveTransaction");
//   }

//   return {
//     resetNonceAndBalance,
//     placeBet,
//     verifyRoll,
//     getHashedServerSeed,
//     getPreviousServerSeed,
//     calculateGameOdds,
//     generateClientSeed,
//     houseEdgePercent,
//     isLoading,
//     playNewMoveTransaction,
//   };
// }
