import { useState, type ChangeEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { CheckIcon, CopyIcon, ExternalLinkIcon, RocketIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TokenPreview } from "./TokenPreview";
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
  const [created, setCreated] = useState<{
    mint: string;
    symbol: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

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
      toast.success(`Created ${symbol}`, { description: mintAddress });
      setCreated({ mint: mintAddress, symbol });
      setForm(initialForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Could not create token", { description: message });
    } finally {
      setIsCreating(false);
    }
  }

  async function copyMint() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.mint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy the address");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <TokenPreview name={form.name} symbol={form.symbol} image={form.image} />

      <div className="grid gap-5">
        <Field
          id="name"
          label="Name"
          counter={`${form.name.length}/${MAX_NAME_LENGTH}`}
        >
          <Input
            id="name"
            placeholder="Midnight Marigold"
            value={form.name}
            onChange={handleChange}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            type="text"
          />
        </Field>
        <Field
          id="symbol"
          label="Symbol"
          counter={`${form.symbol.length}/${MAX_SYMBOL_LENGTH}`}
        >
          <Input
            id="symbol"
            placeholder="MARI"
            value={form.symbol}
            onChange={handleChange}
            maxLength={MAX_SYMBOL_LENGTH}
            autoComplete="off"
            type="text"
          />
        </Field>
        <Field id="image" label="Image URL" hint="Optional">
          <Input
            id="image"
            placeholder="https://…/logo.png"
            value={form.image}
            onChange={handleChange}
            autoComplete="off"
            type="url"
          />
        </Field>
        <Field id="metadata" label="Metadata URI" hint="Optional · JSON">
          <Input
            id="metadata"
            placeholder="https://…/metadata.json"
            value={form.metadata}
            onChange={handleChange}
            autoComplete="off"
            type="url"
          />
        </Field>
      </div>

      <Button
        variant="brand"
        size="xl"
        onClick={createToken}
        disabled={isCreating}
      >
        <RocketIcon />
        {isCreating ? "Waiting for your wallet…" : "Launch token"}
      </Button>

      {created && (
        <div className="rounded-2xl border bg-accent/60 p-4 text-left">
          <p className="text-sm font-semibold">
            {created.symbol} is live on devnet
          </p>
          <p className="mt-2 break-all rounded-lg bg-background/70 px-3 py-2 font-mono text-xs text-muted-foreground">
            {created.mint}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copyMint}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Copied" : "Copy address"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://explorer.solana.com/address/${created.mint}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon />
                View on Explorer
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  counter,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  counter?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2 text-left">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-xs text-muted-foreground">{counter ?? hint}</span>
      </div>
      {children}
    </div>
  );
}
