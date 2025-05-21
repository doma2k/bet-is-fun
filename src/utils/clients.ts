// import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { base, monadTestnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Bet on Fun",
  projectId: "bet.warpcast",
  chains: [base, monadTestnet],
  transports: {
    [base.id]: http(),
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
