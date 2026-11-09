/**
 * Idioma das iscas. A mesma isca existe em português e em inglês (UK); o idioma vem do
 * parâmetro ?lang=en na URL (o padrão é português). A automação de direct da palavra em inglês
 * manda o link já com ?lang=en.
 */
export type Lang = "pt" | "en";

export function lerLang(valor: string | null | undefined): Lang {
  return valor === "en" ? "en" : "pt";
}

export const TEXTOS = {
  pt: {
    tituloCaptura: "Preencha os seus dados para receber o material completo",
    botao: "Quero o material",
    nome: "Nome",
    nomePlaceholder: "Seu nome",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "(11) 91234-5678",
    preencha: "Preencha seu nome e seu WhatsApp.",
    falhou: "Não deu pra enviar. Confere a internet e tenta de novo.",
    enviando: "Enviando...",
    confereZap: "Confere o seu WhatsApp.",
    privacidadeAntes: "Ao enviar, você concorda em receber este material e conteúdos relacionados, e aceita a",
    privacidadeLink: "política de privacidade",
    privacidadeDepois: ". Você pode pedir a exclusão dos seus dados quando quiser.",
    conteudoGratuito: "Conteúdo gratuito",
    politica: "Política de privacidade",
  },
  en: {
    tituloCaptura: "Enter your details to get the full material",
    botao: "Send me the material",
    nome: "Name",
    nomePlaceholder: "Your name",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "+353 85 123 4567",
    preencha: "Please enter your name and your WhatsApp number.",
    falhou: "We couldn't send it. Check your connection and try again.",
    enviando: "Sending...",
    confereZap: "Please include your country code, e.g. +353 85 123 4567.",
    privacidadeAntes: "By submitting, you agree to receive this material and related content, and accept the",
    privacidadeLink: "privacy policy",
    privacidadeDepois: ". You can ask us to delete your data at any time.",
    conteudoGratuito: "Free content",
    politica: "Privacy policy",
  },
} as const;
