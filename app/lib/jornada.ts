/**
 * Jornada do lead: depois do formulário, o id do lead fica guardado no navegador e cada passo
 * (abrir o material, baixar o PDF, clicar no convite) vira um evento no Supabase.
 * O banco avança a etapa do lead no CRM sozinho (ver supabase-schema.sql, parte 5).
 */

import { cabecalhosSupabase, supabaseConfigurado } from "./enviar-lead";

const KEY = "iscas_lead_id";

export type PassoJornada = "abriu_conteudo" | "baixou_pdf" | "clicou_convite";

export function gerarLeadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16),
  );
}

export function salvarLeadId(id: string) {
  try {
    localStorage.setItem(KEY, id);
  } catch {}
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function leadIdSalvo(): string | null {
  // Se você mandar o link do material pra alguém com ?lid={id do lead}, a jornada continua
  // contando mesmo que a pessoa abra em outro navegador.
  try {
    const daUrl = new URLSearchParams(window.location.search).get("lid");
    if (daUrl && UUID.test(daUrl)) {
      salvarLeadId(daUrl);
      return daUrl;
    }
  } catch {}
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function registrarJornada(type: PassoJornada, data: Record<string, string> = {}) {
  const leadId = leadIdSalvo();
  if (!leadId || !supabaseConfigurado()) return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  fetch(`${url}/rest/v1/lead_events`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      ...cabecalhosSupabase(key),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ lead_id: leadId, type, data }),
  }).catch(() => {});
}
