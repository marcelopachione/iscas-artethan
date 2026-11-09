import type { Metadata } from "next";
import { AUTHOR_NAME } from "../../components/ui";
import { PaginaCaptura } from "../../components/pagina-captura";
import { lerLang } from "../../lib/i18n";
import { CONTEUDO } from "../conteudo";

// Página de captura da isca: /comandos/lead (português) e /comandos/lead?lang=en (inglês).
// O slug TEM que ser o nome da pasta (é pra lá que a pessoa vai depois do formulário).
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const c = CONTEUDO[lerLang((await searchParams).lang)];
  return { title: `${c.titulo} | ${AUTHOR_NAME}`, description: c.descricao };
}

export default function Page() {
  return <PaginaCaptura slug="comandos" />;
}
