import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Logo } from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { PaletteSwitcher } from "./PaletteSwitcher";
import TokenLaunchpad from "./TokenLaunchpad";

const FACTS = [
  { value: "1", label: "signature to launch" },
  { value: "6", label: "decimals, fixed" },
  { value: "100%", label: "authority stays yours" },
];

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="page-aura" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 py-6">
          <a href="/" className="flex items-center gap-2.5">
            <Logo className="size-9" />
            <span className="font-display text-xl font-semibold tracking-tight">
              Launchpad
            </span>
          </a>
          <div className="flex items-center gap-2">
            <PaletteSwitcher />
            <ModeToggle />
            <WalletMultiButton />
          </div>
        </header>

        <main className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
          <section className="text-left">
            <p className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-brand" />
              Solana · Token-2022 · Devnet
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Launch a token in a{" "}
              <em className="font-medium text-brand-text">single signature.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Name it, give it a symbol and a face, and mint it on Solana with
              its metadata stored on-chain. No code, no extra programs, no
              middlemen.
            </p>

            <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x border-y">
              {FACTS.map((fact) => (
                <div key={fact.label} className="px-4 py-5 first:pl-0">
                  <dt className="font-display text-3xl font-semibold text-brand-text">
                    {fact.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="silver-edge rounded-[1.75rem] p-px shadow-2xl shadow-black/10">
            <div className="rounded-[calc(1.75rem-1px)] bg-card/95 p-6 backdrop-blur sm:p-8">
              <h2 className="mb-6 text-left font-display text-2xl font-semibold">
                Create your token
              </h2>
              <TokenLaunchpad />
            </div>
          </section>
        </main>

        <footer className="py-8 text-center text-xs text-muted-foreground">
          Devnet only. Tokens created here carry no real value.
        </footer>
      </div>
    </div>
  );
}
