"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { enviarLead } from "../lib/enviar-lead";
import { lerLang, TEXTOS, type Lang } from "../lib/i18n";
import { gerarLeadId, salvarLeadId } from "../lib/jornada";
import { normalizarWhatsApp } from "../lib/telefone";
import { CampoWhatsApp } from "./campo-whatsapp";
import { Container, ProfileLine, SiteFooter, goButtonClass } from "./ui";

/**
 * A página de captura inteira, igual em toda isca: sua foto, nome e @ no topo, campos Nome e
 * WhatsApp, botão verde. Ao enviar, salva o lead no Supabase e leva a pessoa direto pro material
 * (/{slug}), levando junto os parâmetros de origem (utm_*).
 *
 * Cada isca só usa assim, em app/{slug}/lead/page.tsx:
 *   <PaginaCaptura slug="meu-slug" />
 */

const PASSA_ADIANTE = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "lang"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

const inputClass =
  "h-12 w-full rounded-lg border border-card-border bg-card px-3.5 text-[16px] text-foreground placeholder:text-muted transition-colors focus:border-muted focus:bg-background focus:outline-none";

const labelClass = "block text-[14px] font-semibold";

type Props = {
  /** O slug da isca: o mesmo nome da pasta em app/. É ele que fica gravado no lead. */
  slug: string;
  /** Frase grande acima do formulário. */
  titulo?: string;
  /** Texto do botão verde. */
  botao?: string;
};

function Formulario({ slug, botao, lang }: { slug: string; botao: string; lang: Lang }) {
  const t = TEXTOS[lang];
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zapInvalido, setZapInvalido] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value.trim();
    const zapDigitado = (form.elements.namedItem("whatsapp") as HTMLInputElement).value.trim();

    if (!nome || !zapDigitado) {
      setError(t.preencha);
      return;
    }

    // Em inglês o número vem sempre com o código do país (+353, +44...), então não aplica a regra do Brasil
    const semCodigoEn = lang === "en" && !zapDigitado.startsWith("+");
    const zap = normalizarWhatsApp(zapDigitado);
    if (semCodigoEn || !zap.valido) {
      setZapInvalido(true);
      setError(lang === "en" ? t.confereZap : (zap.motivo ?? t.confereZap));
      return;
    }

    setLoading(true);

    const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, searchParams.get(k)?.slice(0, 120) || null])) as Record<
      (typeof UTM_KEYS)[number],
      string | null
    >;
    const leadId = gerarLeadId();

    const resultado = await enviarLead({
      id: leadId,
      nome: nome.slice(0, 120),
      whatsapp: zap.e164,
      isca: slug,
      ...utm,
      referrer: typeof document !== "undefined" && document.referrer ? document.referrer.slice(0, 500) : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
    });

    if (resultado === "falhou") {
      setError(t.falhou);
      setLoading(false);
      return;
    }

    if (resultado === "salvo") {
      salvarLeadId(leadId);
      const w = window as Window & { fbq?: (...args: unknown[]) => void };
      w.fbq?.("track", "Lead", { content_name: slug });
    }

    // Leva pro material, preservando a origem
    const destino = new URL(`/${slug}`, window.location.origin);
    PASSA_ADIANTE.forEach((k) => {
      const v = searchParams.get(k);
      if (v) destino.searchParams.set(k, v);
    });
    router.push(destino.pathname + destino.search);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="nome" className={labelClass}>
          {t.nome}
        </label>
        <input type="text" id="nome" name="nome" placeholder={t.nomePlaceholder} autoComplete="name" required maxLength={120} className={inputClass} />
      </div>

      <CampoWhatsApp
        lang={lang}
        inputClass={inputClass}
        labelClass={labelClass}
        invalido={zapInvalido}
        onDigitar={() => {
          if (zapInvalido) setZapInvalido(false);
          if (error) setError("");
        }}
      />

      {error && (
        <p role="alert" className="rounded-lg bg-live-soft px-3.5 py-3 text-[14px] font-semibold text-live">
          {error}
        </p>
      )}

      <div className="pt-2">
        <button type="submit" disabled={loading} className={goButtonClass}>
          {loading ? t.enviando : botao}
          {!loading && (
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>
      </div>

      <p className="text-center text-[12px] leading-relaxed text-muted">
        {t.privacidadeAntes}{" "}
        <a href={lang === "en" ? "/privacidade?lang=en" : "/privacidade"} className="font-semibold text-link hover:underline">
          {t.privacidadeLink}
        </a>
        {t.privacidadeDepois}
      </p>
    </form>
  );
}

function Capa({ slug, titulo, botao }: Props) {
  const lang = lerLang(useSearchParams().get("lang"));
  const t = TEXTOS[lang];
  titulo = titulo ?? t.tituloCaptura;
  botao = botao ?? t.botao;
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center">
        <Container size="sm" className="space-y-5 py-8 sm:py-12">
          <h1 className="text-center text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[32px]">{titulo}</h1>
          <div className="rounded-2xl border border-card-border p-5 sm:p-6">
            <div className="mb-6">
              <ProfileLine size={48} />
            </div>
            <Formulario slug={slug} botao={botao} lang={lang} />
          </div>
        </Container>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

export function PaginaCaptura(props: Props) {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <Capa {...props} />
    </Suspense>
  );
}
