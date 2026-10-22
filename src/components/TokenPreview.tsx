import { useState } from "react";

type TokenPreviewProps = {
  name: string;
  symbol: string;
  image: string;
};

export function TokenPreview({ name, symbol, image }: TokenPreviewProps) {
  const [failedImage, setFailedImage] = useState("");
  const showImage = image && failedImage !== image;
  const initial = (symbol || name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-background/50 p-4">
      <div className="token-coin relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-2xl font-semibold text-brand-foreground">
        {showImage ? (
          <img
            src={image}
            alt=""
            className="size-full object-cover"
            onError={() => setFailedImage(image)}
          />
        ) : (
          initial
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-display text-xl font-semibold leading-tight">
          {name || "Your token"}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary px-2.5 py-0.5 font-semibold tracking-wide text-primary-foreground">
            {symbol ? symbol.toUpperCase() : "SYMBOL"}
          </span>
          <span className="text-muted-foreground">
            6 decimals · Token-2022 · Devnet
          </span>
        </div>
      </div>
    </div>
  );
}
