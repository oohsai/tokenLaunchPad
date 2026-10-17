import "./App.css";
import Home from "./components/Home";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

function App() {
  return (
    <ThemeProvider>
      <ConnectionProvider endpoint={DEVNET_ENDPOINT}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <Home />
            <Toaster />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;
