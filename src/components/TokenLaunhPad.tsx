import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  createInitializeMint2Instruction,
  createMint,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection } from "@solana/web3.js";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function TokenLaunhPad() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    image: "",
    metadata: "",
  });

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  }
  async function createToken() {
    if (!wallet.publicKey) {
      alert("Connect wallet first");
      return;
    }
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keyPair = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: keyPair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        keyPair.publicKey,
        6,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID,
      ),
    );
    const blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    transaction.partialSign(keyPair);
    await wallet.sendTransaction(transaction, connection);
  }

  return (
    <div className="max-w-lg ">
      <h1 className="text-5xl font-bold">Token Launchpad</h1>
      <Input
        id="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        type="text"
      ></Input>
      <Input
        id="symbol"
        placeholder="Symbol"
        value={form.symbol}
        onChange={handleChange}
        type="text"
      ></Input>
      <Input
        id="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        type="text"
      ></Input>
      <Input
        id="metadata"
        placeholder="Metadata"
        value={form.metadata}
        onChange={handleChange}
        type="text"
      ></Input>
      <Button onClick={createToken}>Create token</Button>
    </div>
  );
}
