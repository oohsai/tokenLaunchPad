import React from "react";
import TokenLaunhPad from "./TokenLaunhPad";
import { ModeToggle } from "./mode-toggle";
import { createMint } from "@solana/spl-token";

export default function Home() {
  return (
    <div>
      <ModeToggle></ModeToggle>
      <TokenLaunhPad></TokenLaunhPad>
    </div>
  );
}
