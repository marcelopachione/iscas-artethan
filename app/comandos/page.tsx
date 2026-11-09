import type { Metadata } from "next";
import { CopyBlock } from "../components/copy-block";
import { CTASection } from "../components/cta-section";
import { DownloadPdfLink } from "../components/download-pdf-link";
import { TrackView } from "../components/track-view";
import { AUTHOR_NAME, Container, Label, SiteFooter, SiteHeader } from "../components/ui";
import { lerLang } from "../lib/i18n";
import { CONTEUDO, FONTES, SLUG } from "./conteudo";

type Props = { searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const c = CONTEUDO[lerLang((await searchParams).lang)];
  return { title: `${c.titulo} | ${AUTHOR_NAME}`, description: c.descricao };
}

// ============================================
// PÁGINA DO MATERIAL: 15 comandos escondidos do ChatGPT
// O texto mora em ./conteudo.ts (português e inglês). Aqui fica só o visual.
// ============================================

export default async function ComandosPage({ searchParams }: Props) {
  const lang = lerLang((await searchParams).lang);
  const c = CONTEUDO[lang];

  return (
    <div className="min-h-screen" lang={lang === "en" ? "en-GB" : "pt-BR"}>
      <SiteHeader lang={lang} />
      <TrackView isca={SLUG} />

      <main>
        <Container className="space-y-6 pt-8 sm:pt-12">
          {/* Abertura */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Label pill>{c.selo}</Label>
              <a href={c.outroIdioma.href} className="text-[13px] font-semibold text-link hover:underline" data-no-print>
                {c.outroIdioma.rotulo}
              </a>
            </div>
            <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[46px]">{c.titulo}</h1>
            <p className="text-[17px] leading-relaxed text-foreground/75">{c.intro}</p>
            <div data-no-print>
              <DownloadPdfLink href={`/api/${SLUG}-pdf?lang=${lang}`} label={c.baixarPdf} />
            </div>
          </div>

          <CTASection compact />

          <article className="space-y-6 pt-2">
            {/* Como usar + aviso honesto */}
            <section className="space-y-4 rounded-2xl border border-card-border p-5 sm:p-6">
              <h2 className="text-[21px] font-bold tracking-tight">{c.comoUsarTitulo}</h2>
              <ol className="space-y-2 text-[16px] leading-relaxed text-foreground/80">
                {c.comoUsar.map((s, i) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="font-bold text-foreground">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="rounded-xl bg-card px-4 py-3.5">
                <p className="mb-1 text-[13px] font-bold">{c.avisoTitulo}</p>
                <p className="text-[15px] leading-relaxed">{c.aviso}</p>
              </div>
            </section>

            {/* Os 15 comandos */}
            <ol className="space-y-4">
              {c.comandos.map((cmd, i) => (
                <li key={cmd.comando} className="space-y-4 rounded-2xl border border-card-border p-5 sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[15px] font-bold text-background">
                      {i + 1}
                    </span>
                    <div className="min-w-0 space-y-1.5">
                      <h2 className="text-[21px] font-bold leading-snug tracking-tight sm:text-[23px]">
                        <span className="font-mono">{cmd.comando}</span>
                      </h2>
                      <p className="text-[16px] font-semibold leading-relaxed text-foreground/80">{cmd.nome}</p>
                    </div>
                  </div>

                  <p className="text-[16px] leading-relaxed text-foreground/75">
                    <strong className="text-foreground">{c.quandoRotulo}: </strong>
                    {cmd.quando}
                  </p>

                  <CopyBlock text={cmd.prompt} label={c.copiar} copiado={lang === "en" ? "Copied ✓" : "Copiado ✓"} />

                  <div className="rounded-xl bg-card px-4 py-3.5">
                    <p className="mb-1 text-[13px] font-bold">{c.exemploRotulo}</p>
                    <p className="text-[15px] leading-relaxed [overflow-wrap:anywhere]">{cmd.exemplo}</p>
                  </div>
                </li>
              ))}
            </ol>

            <section className="space-y-3">
              <h2 className="px-1 text-[21px] font-bold tracking-tight">{c.checklistTitulo}</h2>
              <CopyBlock text={c.checklist} label={c.copiar} copiado={lang === "en" ? "Copied ✓" : "Copiado ✓"} destacar={false} />
            </section>

            <section className="space-y-2 rounded-2xl border border-card-border p-5 sm:p-6">
              <p className="text-[13px] font-bold">{c.dicaTitulo}</p>
              <p className="text-[19px] font-semibold leading-snug sm:text-[21px]">{c.dicaTexto}</p>
            </section>

            <section className="space-y-2 px-1">
              <h2 className="text-[15px] font-bold">{c.fontesTitulo}</h2>
              <ol className="space-y-1.5 text-[14px] leading-relaxed text-muted">
                {FONTES.map((f, i) => (
                  <li key={f.url} className="flex gap-2">
                    <span>{i + 1}.</span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-link hover:underline [overflow-wrap:anywhere]">
                      {f.titulo}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          </article>

          <div className="pt-4">
            <CTASection />
          </div>
        </Container>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
