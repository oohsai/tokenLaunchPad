import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
} from "@solana/spl-token-metadata";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const DECIMALS = 6;
const MAX_NAME_LENGTH = 32;
const MAX_SYMBOL_LENGTH = 10;

type FormState = {
  name: string;
  symbol: string;
  image: string;
  metadata: string;
};

const initialForm: FormState = {
  name: "",
  symbol: "",
  image: "",
  metadata: "",
};

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validate({ name, symbol, image, metadata }: FormState) {
  if (!name.trim()) return "Name is required";
  if (name.trim().length > MAX_NAME_LENGTH)
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer`;
  if (!symbol.trim()) return "Symbol is required";
  if (symbol.trim().length > MAX_SYMBOL_LENGTH)
    return `Symbol must be ${MAX_SYMBOL_LENGTH} characters or fewer`;
  if (image && !isHttpUrl(image)) return "Image URL must be a valid http(s) URL";
  if (metadata && !isHttpUrl(metadata))
    return "Metadata must be a valid http(s) URL";
  return null;
}

export default function TokenLaunchpad() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isCreating, setIsCreating] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  async function createToken() {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      toast.error("Connect your wallet first");
      return;
    }

    const error = validate(form);
    if (error) {
      toast.error(error);
      return;
    }

    const payer = wallet.publicKey;
    const name = form.name.trim();
    const symbol = form.symbol.trim();
    const uri = form.metadata.trim();
    const image = form.image.trim();

    setIsCreating(true);
    try {
      const mint = Keypair.generate();

      // Token-2022 mint with the metadata stored on-chain: the metadata
      // pointer makes the mint itself the metadata account.
      const additionalMetadata: [string, string][] = image
        ? [["image", image]]
        : [];
      const metadataSize =
        TYPE_SIZE +
        LENGTH_SIZE +
        pack({
          mint: mint.publicKey,
          updateAuthority: payer,
          name,
          symbol,
          uri,
          additionalMetadata,
        }).length;
      const mintSize = getMintLen([ExtensionType.MetadataPointer]);
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintSize + metadataSize,
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: mint.publicKey,
          space: mintSize,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mint.publicKey,
          payer,
          mint.publicKey,
          TOKEN_2022_PROGRAM_ID,
        ),
        createInitializeMint2Instruction(
          mint.publicKey,
          DECIMALS,
          payer,
          payer,
          TOKEN_2022_PROGRAM_ID,
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: mint.publicKey,
          updateAuthority: payer,
          mint: mint.publicKey,
          mintAuthority: payer,
          name,
          symbol,
          uri,
        }),
      );

      for (const [field, value] of additionalMetadata) {
        transaction.add(
          createUpdateFieldInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            metadata: mint.publicKey,
            updateAuthority: payer,
            field,
            value,
          }),
        );
      }

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer;

      const signature = await wallet.sendTransaction(transaction, connection, {
        signers: [mint],
      });
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed",
      );

      const mintAddress = mint.publicKey.toBase58();
      toast.success(`Created ${symbol}`, {
        description: mintAddress,
        action: {
          label: "View",
          onClick: () =>
            window.open(
              `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
              "_blank",
              "noopener,noreferrer",
            ),
        },
      });
      setForm(initialForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Could not create token", { description: message });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 pt-8">
      <h1 className="text-5xl font-bold">Token Launchpad</h1>
      <p className="text-muted-foreground">
        Create a Token-2022 mint on Solana devnet with on-chain metadata.
      </p>
      <Input
        id="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        maxLength={MAX_NAME_LENGTH}
        type="text"
      />
      <Input
        id="symbol"
        placeholder="Symbol"
        value={form.symbol}
        onChange={handleChange}
        maxLength={MAX_SYMBOL_LENGTH}
        type="text"
      />
      <Input
        id="image"
        placeholder="Image URL (optional)"
        value={form.image}
        onChange={handleChange}
        type="url"
      />
      <Input
        id="metadata"
        placeholder="Metadata URI (JSON, optional)"
        value={form.metadata}
        onChange={handleChange}
        type="url"
      />
      <Button onClick={createToken} disabled={isCreating}>
        {isCreating ? "Creating…" : "Create token"}
      </Button>
    </div>
  );
}
