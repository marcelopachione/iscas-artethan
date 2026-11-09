/**
 * Peças básicas do visual (estilo Instagram). Toda isca usa estas, em vez de estilizar na mão.
 *
 * Seu nome, @ e selo vêm do .env.local:
 *   NEXT_PUBLIC_AUTHOR_NAME, NEXT_PUBLIC_AUTHOR_HANDLE, NEXT_PUBLIC_VERIFIED
 * Sua foto vem do arquivo public/avatar.jpg (troque pela foto de perfil do seu Instagram).
 */

export const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Seu Nome";
export const AUTHOR_HANDLE = (process.env.NEXT_PUBLIC_AUTHOR_HANDLE || "seuperfil").trim().replace(/^@/, "");
const VERIFIED = process.env.NEXT_PUBLIC_VERIFIED === "true";

/** Etiqueta pequena (ex: "Material gratuito"). `pill` deixa em cápsula cinza. */
export function Label({
  children,
  className = "",
  pill,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  pill?: boolean;
  as?: "p" | "span" | "h2" | "h3";
}) {
  const base = pill
    ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[13px] font-semibold text-foreground"
    : "text-[13px] font-semibold text-muted";
  return <Tag className={`${base} ${className}`}>{children}</Tag>;
}

/** Container padrão. Coluna estreita, como o feed. */
export function Container({
  children,
  className = "",
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const width = size === "sm" ? "max-w-lg" : size === "lg" ? "max-w-4xl" : "max-w-2xl";
  return <div className={`mx-auto w-full ${width} px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function VerifiedBadge({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`${className} shrink-0 text-verified`} aria-label="Verificado" role="img">
      <path
        fill="currentColor"
        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
      />
    </svg>
  );
}

/** Foto de perfil com o anel colorido de story. */
export function Avatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 rounded-full bg-[linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)] p-[2px]"
      style={{ width: size, height: size }}
    >
      <span className="block size-full rounded-full bg-background p-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/avatar.jpg" alt={AUTHOR_NAME} className="size-full rounded-full object-cover" />
      </span>
    </span>
  );
}

/** Cabeçalho de post: foto + nome + selo + @. */
export function ProfileLine({ size = 40, subtitle }: { size?: number; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size={size} />
      <div className="min-w-0 leading-tight">
        <p className="flex items-center gap-1 text-[15px] font-semibold">
          {AUTHOR_NAME}
          {VERIFIED && <VerifiedBadge className="size-[15px]" />}
        </p>
        <p className="text-[14px] text-muted">{subtitle ?? `@${AUTHOR_HANDLE}`}</p>
      </div>
    </div>
  );
}

export function SiteHeader({ lang = "pt" }: { lang?: "pt" | "en" }) {
  return (
    <header className="sticky top-0 z-20 border-b border-card-border bg-background/90 backdrop-blur" data-no-print>
      <Container size="lg" className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar size={32} />
          <span className="flex items-center gap-1 text-[15px] font-semibold">
            {AUTHOR_HANDLE}
            {VERIFIED && <VerifiedBadge className="size-[14px]" />}
          </span>
        </div>
        <span className="text-[13px] font-semibold text-muted">{lang === "en" ? "Free content" : "Conteúdo gratuito"}</span>
      </Container>
    </header>
  );
}

export function SiteFooter({ lang = "pt" }: { lang?: "pt" | "en" }) {
  return (
    <footer className="mt-16 pb-10" data-no-print>
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-muted">
        <span>
          © {new Date().getFullYear()} {AUTHOR_NAME}
        </span>
        <span aria-hidden>·</span>
        <a href={lang === "en" ? "/privacidade?lang=en" : "/privacidade"} className="hover:underline">
          {lang === "en" ? "Privacy policy" : "Política de privacidade"}
        </a>
      </Container>
    </footer>
  );
}

/** Classe do botão verde de conversão (pulso + laser). Use em <button> ou <a>. */
export const goButtonClass =
  "laser laser-go pulse-go group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-go px-6 text-[18px] font-bold text-white transition-colors hover:bg-go-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:[animation:none]";

/** Botão cinza secundário, igual ao "Editar perfil" do Instagram. */
export const softButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-soft px-4 text-[15px] font-semibold text-foreground transition-colors hover:bg-soft-hover";
