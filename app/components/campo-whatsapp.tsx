"use client";

import { useState } from "react";
import { TEXTOS, type Lang } from "../lib/i18n";
import { apagarUltimoDigito, mascararWhatsApp, soDigitos } from "../lib/telefone";

/**
 * Campo de WhatsApp com máscara brasileira: vai formatando (11) 91234-5678 enquanto a pessoa digita.
 * Número de outro país funciona começando com + (ex: +351...).
 * A validação de verdade acontece no envio (normalizarWhatsApp, em lib/telefone.ts).
 */
export function CampoWhatsApp({
  inputClass,
  labelClass,
  invalido,
  onDigitar,
  lang = "pt",
}: {
  lang?: Lang;
  inputClass: string;
  labelClass: string;
  invalido?: boolean;
  onDigitar?: () => void;
}) {
  // Em inglês o campo já começa com "+", pra pessoa digitar o código do país
  const [valor, setValor] = useState(lang === "en" ? "+" : "");

  function mudar(e: React.ChangeEvent<HTMLInputElement>) {
    const novo = e.target.value;
    // Apagou só um "(", ")", " " ou "-": apaga o dígito anterior, senão o campo trava
    if (novo.length < valor.length && soDigitos(novo) === soDigitos(valor)) {
      setValor(apagarUltimoDigito(valor));
    } else {
      setValor(mascararWhatsApp(novo));
    }
    onDigitar?.();
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor="whatsapp" className={labelClass}>
        {TEXTOS[lang].whatsapp}
      </label>
      <input
        type="tel"
        id="whatsapp"
        name="whatsapp"
        inputMode="tel"
        autoComplete="tel"
        required
        value={valor}
        onChange={mudar}
        placeholder={TEXTOS[lang].whatsappPlaceholder}
        aria-invalid={invalido || undefined}
        className={`${inputClass} ${invalido ? "!border-live" : ""}`}
      />
    </div>
  );
}
