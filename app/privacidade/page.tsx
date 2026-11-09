import type { Metadata } from "next";
import { AUTHOR_NAME, Container, Label, SiteFooter, SiteHeader } from "../components/ui";
import { lerLang } from "../lib/i18n";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "seu@email.com";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const en = lerLang((await searchParams).lang) === "en";
  return {
    title: `${en ? "Privacy policy" : "Política de privacidade"} | ${AUTHOR_NAME}`,
    description: en
      ? "How your data is collected and used, and how to ask for its deletion."
      : "Como seus dados são coletados, usados e como pedir a exclusão.",
  };
}

/**
 * MODELO de política de privacidade, cobrindo o básico da LGPD pra uma página de captura.
 *
 * ⚠️ ISTO NÃO É PARECER JURÍDICO. É um ponto de partida honesto que descreve exatamente o que
 * este sistema faz. Se você trata dado sensível, vende pra empresa grande ou opera em volume,
 * vale passar por um advogado.
 *
 * Antes de publicar, preencha NEXT_PUBLIC_AUTHOR_NAME e NEXT_PUBLIC_CONTACT_EMAIL.
 */

const SECOES: { titulo: string; itens?: string[]; texto?: React.ReactNode }[] = [
  {
    titulo: "Quem coleta",
    texto: (
      <>
        Os dados desta página são coletados por {AUTHOR_NAME}. Para qualquer assunto relacionado aos seus dados, o contato é{" "}
        <strong>{CONTACT_EMAIL}</strong>.
      </>
    ),
  },
  {
    titulo: "O que é coletado",
    itens: [
      "Nome e WhatsApp, informados por você no formulário",
      "Origem da visita (de qual campanha ou link você chegou)",
      "Data e hora do cadastro e quais partes do material você abriu",
    ],
  },
  {
    titulo: "Para que é usado",
    itens: [
      "Entregar o material que você pediu",
      "Enviar conteúdos, convites e ofertas relacionados ao tema",
      "Entender quais conteúdos trazem mais interessados",
    ],
    texto: "A base legal é o seu consentimento, dado no momento em que você envia o formulário.",
  },
  {
    titulo: "Com quem é compartilhado",
    texto:
      "Os dados ficam armazenados no Supabase e o site é hospedado na Vercel. Se houver remarketing, o Meta (Facebook e Instagram) recebe dados de navegação para exibir anúncios. Seus dados não são vendidos.",
  },
  {
    titulo: "Seus direitos",
    texto: (
      <>
        Pela LGPD, você pode pedir a qualquer momento a confirmação, o acesso, a correção ou a <strong>exclusão</strong> dos seus
        dados, e pode retirar o consentimento. Basta escrever para <strong>{CONTACT_EMAIL}</strong>. O pedido é atendido em até 15
        dias.
      </>
    ),
  },
  {
    titulo: "Por quanto tempo",
    texto: "Os dados ficam guardados enquanto durar o relacionamento, ou até você pedir a exclusão.",
  },
];


const SECOES_EN: { titulo: string; itens?: string[]; texto?: React.ReactNode }[] = [
  {
    titulo: "Who collects your data",
    texto: (
      <>
        The data on this page is collected by {AUTHOR_NAME}. For anything related to your data, contact <strong>{CONTACT_EMAIL}</strong>.
      </>
    ),
  },
  {
    titulo: "What we collect",
    itens: [
      "Your name and WhatsApp number, entered by you in the form",
      "Where your visit came from (the campaign or link you arrived through)",
      "The date and time of sign-up and which parts of the material you opened",
    ],
  },
  {
    titulo: "What we use it for",
    itens: [
      "Delivering the material you asked for",
      "Sending content, invitations and offers related to the topic",
      "Understanding which content brings the most interested people",
    ],
    texto: "The legal basis is your consent, given when you submit the form. You can withdraw it at any time.",
  },
  {
    titulo: "Who we share it with",
    texto:
      "Your data is stored on Supabase and the site is hosted on Vercel. If remarketing is used, Meta (Facebook and Instagram) receives browsing data to show ads. Your data is not sold. Data may be processed outside the UK and the EEA by these providers.",
  },
  {
    titulo: "Your rights",
    texto: (
      <>
        Under data protection law (UK GDPR / EU GDPR, and Brazil&apos;s LGPD where it applies), you can ask us at any time to confirm, access, correct or <strong>delete</strong> your data, to restrict or object to its use, and to withdraw your consent. Just write to <strong>{CONTACT_EMAIL}</strong>. We respond within one month. You can also complain to your local data protection authority.
      </>
    ),
  },
  {
    titulo: "How long we keep it",
    texto: "Your data is kept for as long as our relationship lasts, or until you ask us to delete it.",
  },
];

export default async function PrivacidadePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const lang = lerLang((await searchParams).lang);
  const SECOES_USADAS = lang === "en" ? SECOES_EN : SECOES;
  return (
    <div className="min-h-screen" lang={lang === "en" ? "en-GB" : "pt-BR"}>
      <SiteHeader lang={lang} />
      <main>
        <Container className="pt-8 sm:pt-12">
          <header className="space-y-3 border-b border-card-border pb-6">
            <Label>{lang === "en" ? "Last updated" : "Última atualização"}: {new Date().getFullYear()}</Label>
            <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[40px]">{lang === "en" ? "Privacy policy" : "Política de privacidade"}</h1>
          </header>

          {SECOES_USADAS.map((s) => (
            <section key={s.titulo} className="space-y-2 border-b border-card-border py-6">
              <h2 className="text-[17px] font-bold">{s.titulo}</h2>
              <div className="space-y-3 text-[16px] leading-relaxed text-muted">
                {s.itens && (
                  <ul className="list-disc space-y-1 pl-5">
                    {s.itens.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                )}
                {s.texto && <p>{s.texto}</p>}
              </div>
            </section>
          ))}
        </Container>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
