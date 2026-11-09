import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";
import { CONVITE, TEM_CONVITE } from "../../lib/convite";
import { semAcento } from "../../lib/pdf-text";
import { lerLang } from "../../lib/i18n";
import { CONTEUDO, FONTES, SLUG } from "../../comandos/conteudo";

// PDF da isca: /api/comandos-pdf (?lang=en pro inglês)
// Lê o mesmo conteudo.ts da página. Todo texto passa por semAcento() (o jsPDF quebra com acento).

export const dynamic = "force-dynamic";

const INK = [0, 0, 0] as const;
const GRAY = [95, 95, 95] as const;
const BOX = [245, 245, 245] as const;
const VERDE = [22, 163, 74] as const;

const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Seu Nome";

export async function GET(request: Request) {
  const lang = lerLang(new URL(request.url).searchParams.get("lang"));
  const c = CONTEUDO[lang];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const mL = 20;
  const cW = pageW - mL * 2;
  let y = 22;

  function check(n: number) {
    if (y + n > pageH - 18) {
      doc.addPage();
      y = 22;
    }
  }

  function text(
    t: string,
    opts: { size: number; bold?: boolean; color?: readonly [number, number, number]; lh: number; indent?: number; after?: number },
  ) {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size);
    doc.setTextColor(...(opts.color ?? INK));
    const w = cW - (opts.indent ?? 0);
    (doc.splitTextToSize(semAcento(t), w) as string[]).forEach((line) => {
      check(opts.lh);
      doc.text(line, mL + (opts.indent ?? 0), y);
      y += opts.lh;
    });
    y += opts.after ?? 0;
  }

  function caixa(t: string) {
    doc.setFont("courier", "normal");
    doc.setFontSize(9.5);
    const linhas: string[] = [];
    semAcento(t)
      .split("\n")
      .forEach((bruta) => (doc.splitTextToSize(bruta || " ", cW - 10) as string[]).forEach((l) => linhas.push(l)));
    const h = linhas.length * 4.8 + 8;
    check(h);
    doc.setFillColor(...BOX);
    doc.roundedRect(mL, y - 4.5, cW, h, 2, 2, "F");
    doc.setTextColor(...INK);
    linhas.forEach((l, i) => doc.text(l, mL + 5, y + 1 + i * 4.8));
    y += h + 3;
  }

  // Capa
  text(`${AUTHOR_NAME.toUpperCase()}  |  ${c.selo.toUpperCase()}`, { size: 8.5, bold: true, color: GRAY, lh: 5, after: 3 });
  text(c.titulo, { size: 20, bold: true, lh: 8.6, after: 3 });
  text(c.intro, { size: 10.5, color: GRAY, lh: 5.2, after: 5 });

  // Como usar + aviso
  text(c.comoUsarTitulo, { size: 12, bold: true, lh: 6, after: 1 });
  c.comoUsar.forEach((s, i) => text(`${i + 1}. ${s}`, { size: 10, lh: 5, indent: 2 }));
  y += 2;
  text(c.avisoTitulo, { size: 10, bold: true, lh: 5 });
  text(c.aviso, { size: 9.5, color: GRAY, lh: 4.8, after: 8 });

  // Os 15 comandos
  c.comandos.forEach((cmd, i) => {
    check(48);
    text(`${i + 1}. ${cmd.comando}  -  ${cmd.nome}`, { size: 13, bold: true, lh: 6.4, after: 1 });
    text(`${c.quandoRotulo}: ${cmd.quando}`, { size: 10, color: GRAY, lh: 5, after: 2 });
    caixa(cmd.prompt);
    text(`${c.exemploRotulo}: ${cmd.exemplo}`, { size: 9.5, color: GRAY, lh: 4.8 });
    y += 6;
  });

  // Checklist
  check(50);
  text(c.checklistTitulo, { size: 13, bold: true, lh: 6.4, after: 2 });
  caixa(c.checklist);
  y += 3;

  // Dica
  check(30);
  text(c.dicaTitulo.toUpperCase(), { size: 8.5, bold: true, color: GRAY, lh: 5 });
  text(c.dicaTexto, { size: 12, bold: true, lh: 6, after: 6 });

  // Fontes
  if (FONTES.length) {
    check(20);
    text(c.fontesTitulo, { size: 10, bold: true, lh: 5 });
    FONTES.forEach((f, i) => text(`${i + 1}. ${f.titulo} - ${f.url}`, { size: 9, color: GRAY, lh: 4.6 }));
    y += 4;
  }

  // Convite (só se estiver configurado)
  if (TEM_CONVITE) {
    check(36);
    doc.setDrawColor(...VERDE);
    doc.setLineWidth(0.6);
    doc.line(mL, y, mL + 30, y);
    y += 7;
    text(CONVITE.selo.toUpperCase(), { size: 8.5, bold: true, color: VERDE, lh: 5 });
    text(CONVITE.titulo, { size: 13, bold: true, lh: 6.4, after: 1 });
    if (CONVITE.texto) text(CONVITE.texto, { size: 10.5, lh: 5.2, after: 2 });
    text(`${CONVITE.botao}: ${CONVITE.url}`, { size: 10.5, bold: true, color: VERDE, lh: 5.2 });
  }

  const pdf = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${SLUG}-${lang}.pdf"`,
    },
  });
}
