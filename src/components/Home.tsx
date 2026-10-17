import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenLaunchpad from "./TokenLaunchpad";
import { ModeToggle } from "./mode-toggle";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-end gap-2">
        <WalletMultiButton />
        <ModeToggle />
      </header>
      <TokenLaunchpad />
    </div>
  );
}
