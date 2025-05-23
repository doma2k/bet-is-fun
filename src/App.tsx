import Game from "./components/Game";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import type { Context } from "@farcaster/frame-core";
import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
// import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { monadTestnet } from "wagmi/chains";
import { config } from "./lib/clients";
// import { YourApp } from "./components/ui/connection";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import AnalogSwitch from "./components/ui/switch";
export default function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [systemPower, setSystemPower] = useState(false);

  useEffect(() => {
    if (isModalOpen && isConnected && address) {
      console.log("User successfully connected:", address);
      setIsModalOpen(false);
    }
  }, [isConnected, address, isModalOpen]);

  const handleConnect = () => {
    setIsModalOpen(true);
    openConnectModal?.();
  };

  useEffect(() => {
    const load = async () => {
      sdk.context
        .then((context) => {
          console.log({ context });
          if (context) {
            setContext(context);
            setSystemPower(true);
            connect({
              chainId: monadTestnet.id,
              connector: config.connectors[0],
            });
            sdk.actions.ready();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
    if (sdk && !isSDKLoaded) {
      console.log(context);
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded, connect, context]);

  return (
    <div className="flex flex-col items-center justify-betwee">
      <Game systemPower={systemPower}>
        <AnalogSwitch
          label="Network"
          size="md"
          initialState={isConnected}
          disabled={false}
          onToggle={async (isOn) => {
            console.log("isOn:", isOn);

            if (!isOn) {
              console.log("logout:", isOn);
              disconnect();
              setSystemPower(false);
              return;
            }

            if (isOn) {
              if (!isConnected) {
                handleConnect();
                setSystemPower(true);
                return;
              }
            }
          }}
        />
      </Game>
      {/* <Toaster
          visibleToasts={1}
          position={"bottom-right"}
          richColors
          expand={true}
        /> */}
    </div>
  );
}
