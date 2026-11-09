# CLAUDE.md — Sistema de iscas

Lido automaticamente pelo Claude Code nesta pasta. Existe pra que o dono do projeto possa pedir "cria uma isca sobre X" e você já saiba exatamente o que fazer. **O dono não é técnico:** explique em português simples, antes de cada comando diga o que ele faz, e nunca mostre o conteúdo do `.env.local`.

## O que é este projeto

Site de **iscas** (materiais gratuitos) em Next.js + Supabase + Vercel. O funil:

1. A pessoa comenta uma palavra no post → a automação de direct manda o link `/{slug}/lead`.
2. Página de captura: foto, nome e @ do dono no topo; **só Nome e WhatsApp**; botão "Quero o material".
3. O lead é salvo no Supabase (nome, WhatsApp, slug, UTMs, referrer) e a pessoa cai **na hora** no material `/{slug}`. **Não existe entrega por WhatsApp nem e-mail.**
4. No material: conteúdo, botão de baixar PDF e um **convite opcional** (aula, grupo, consultoria) que vem do `.env.local`.
5. Cada passo (abriu o material, baixou o PDF, clicou no convite) vira evento e anda sozinho no **CRM de leads** (`/admin`).

## Estrutura

```
app/
  components/
    pagina-captura.tsx   # a página de captura INTEIRA (formulário, máscara, envio, redirect). Toda isca usa
    cta-section.tsx      # convite do fim do material (some se NEXT_PUBLIC_CONVITE_URL estiver vazio)
    download-pdf-link.tsx, copy-block.tsx, track-view.tsx, ui.tsx (cabeçalho, rodapé, botões)
  lib/
    enviar-lead.ts       # grava o lead com 3 tentativas (Supabase direto x2, depois /api/lead)
    jornada.ts           # eventos da jornada → CRM
    telefone.ts          # máscara e validação do WhatsApp
    convite.ts           # lê NEXT_PUBLIC_CONVITE_*
    pdf-text.ts          # semAcento() pro PDF
    admin-servidor.ts    # SÓ servidor: senha do painel + chave service_role
    webhooks.ts          # SÓ servidor: manda o lead pros webhooks do dono (n8n, Make, Zapier...)
  exemplo/               # ISCA MODELO, completa
    conteudo.ts          # o texto (página e PDF leem daqui)
    page.tsx             # /exemplo  (material)
    lead/page.tsx        # /exemplo/lead  (captura: uma linha, <PaginaCaptura slug="exemplo" />)
    lead/layout.tsx      # título/descrição de compartilhamento
  api/
    exemplo-pdf/route.ts # /api/exemplo-pdf
    lead/route.ts        # plano B da captura (mesmo domínio)
    admin/sessao, admin/dados, admin/webhooks   # API do CRM (protegida por ADMIN_SENHA)
    webhooks/lead-novo   # aviso de lead novo pros webhooks (público, só manda lead real, 1 vez)
  admin/                 # o CRM: visão geral, leads, pipeline, webhooks
supabase-schema.sql      # banco completo (pode rodar de novo; aplicado via supabase/migrations + supabase db push)
INDICE-CTAS.md           # palavras de comentário já usadas
```

## Como criar uma isca nova

### 1. Levantar o essencial (pergunte, não invente)

- **Tema e promessa exata:** o que o post/vídeo prometeu entregar, palavra por palavra
- **Palavra do comentário** (ex: `GUIA`, `PROMPTS`, `9KX3H`)
- **Público:** quem é a pessoa e o que ela já sabe

O slug é a palavra em minúsculo, sem acento (ex: `PROMPTS` → `prompts`).

### 2. Reservar a palavra

No `INDICE-CTAS.md`: a palavra não pode existir, nenhuma existente pode ser pedaço dela (nem ela pedaço de outra) e não pode ser palavra comum de comentário (`IA`, `SIM`, `TOP`). Confira também se `app/{slug}/` não existe.

### 3. Pesquisar de verdade

A isca entrega **3 a 5 vezes mais profundidade** que o vídeo. Pesquise (WebSearch/WebFetch), junte fontes reais e confira os links. **Nunca invente número, estatística, case ou link.** Sem fonte, ou fica genérico ou você pergunta ao dono. Mostre o esqueleto do material e espere o OK antes de escrever o código.

### 4. Criar os arquivos (copie de `app/exemplo/`)

```
app/{slug}/conteudo.ts        ← o texto, com acento normal
app/{slug}/page.tsx           ← o visual do material (lê de ./conteudo)
app/{slug}/lead/page.tsx      ← export default () => <PaginaCaptura slug="{slug}" />
app/{slug}/lead/layout.tsx    ← metadata (título e descrição)
app/api/{slug}-pdf/route.ts   ← o PDF (lê de ../../{slug}/conteudo)
```

- No `lead/page.tsx`, o `slug` **tem que ser o nome da pasta**: é pra lá que a pessoa vai depois do formulário e é o que fica gravado no lead. `PaginaCaptura` aceita `titulo` e `botao` se o dono quiser outro texto.
- No `page.tsx`, mantenha `<TrackView isca="{slug}" />`, o `DownloadPdfLink`, o `<CTASection compact />` no topo e o `<CTASection />` no fim.
- No `route.ts` do PDF, **todo texto passa por `semAcento()`** (o jsPDF quebra com acento). O convite já entra sozinho no fim, se estiver configurado.
- Pode criar blocos visuais próprios dentro do `page.tsx` da isca; reaproveite `CopyBlock`, `ProfileLine`, `Label`, `Container` de `components/`.

### 5. Regras de conteúdo

- **Entregue literalmente o que foi prometido.** Prometeu 10 com links? Dez, com links que abrem.
- **Um item copiável por isca** (prompt, checklist, modelo) com `CopyBlock`.
- Termine com a "Dica do criador" (opinião do dono, pergunte se não souber) e as fontes.
- **Não peça e-mail nem outro campo.** O formulário é só Nome e WhatsApp.

### 6. Conferir antes de publicar

```bash
npm run build     # tem que passar limpo
npm run dev       # abrir /{slug}/lead, preencher, conferir que cai em /{slug}
```

Teste o PDF em `http://localhost:3000/api/{slug}-pdf`. Mostre ao dono e espere o OK.

### 7. Publicar e registrar

```bash
git add -A && git commit -m "feat: isca {slug}" && git push
```

O push publica sozinho na Vercel. Confira: `curl -s -o /dev/null -w "%{http_code}" https://SEU-DOMINIO/{slug}/lead` → 200. Adicione a linha no `INDICE-CTAS.md` (palavra, slug, tema, data DD-MM-YYYY, link).

### 8. Entregar

Sempre o link **completo**, com origem marcada (é isso que aparece no CRM):

```
https://SEU-DOMINIO/{slug}/lead?utm_source=instagram&utm_medium=reels&utm_campaign={slug}&utm_content={DD-MM}
```

E a palavra que ele configura na automação de direct.

## CRM de leads (/admin)

- Senha: `ADMIN_SENHA`. O login grava um cookie httpOnly; a API (`/api/admin/dados`) confere em toda chamada.
- Dados lidos **só no servidor** com `SUPABASE_SERVICE_ROLE_KEY` (`app/lib/admin-servidor.ts`). **Nunca** importe esse arquivo nem use essa chave em componente `"use client"` ou variável `NEXT_PUBLIC_`.
- Etapas: `novo → consumiu → convite` (automáticas, pelo banco) e `contato → negociando → cliente / perdido` (o dono arrasta no Pipeline).
- `/admin?demo=1` mostra dados falsos, só em `npm run dev`.

## Webhooks

- O dono cadastra URLs em `/admin → Webhooks` (tabelas `webhooks` e `webhook_entregas`, só service_role). Eventos: `lead.novo` e `lead.etapa` (mudança feita no Pipeline).
- Quem envia é o servidor (`app/lib/webhooks.ts`): POST JSON, timeout 5 s, 1 retentativa, assinatura `X-Webhook-Assinatura: sha256=HMAC(corpo, segredo)` quando há segredo. Tudo em segundo plano (`after`): **falha de webhook nunca bloqueia a captura**.
- Lead novo: a captura chama `/api/webhooks/lead-novo` com `sendBeacon` depois de gravar (o `/api/lead` chama sozinho). Cada lead vai uma vez (`webhook_avisado_at`); leads perdidos das últimas 24 h vão no próximo aviso.
- Disparo de mensagem no WhatsApp **não existe** aqui (é integração paga): oriente o dono a ligar um webhook na ferramenta de WhatsApp dele.

## Banco (Supabase) pela linha de comando

- O schema vive em `supabase-schema.sql` e é aplicado como migração: `supabase/migrations/{data}_*.sql` + `supabase db push --password "$SUPABASE_DB_PASSWORD"` (senha lida do `.env.local`, nunca mostrada).
- Mudou o schema? Crie uma migração nova copiando o arquivo (ele é idempotente) e rode `supabase db push`.

## LGPD (não remova)

O formulário coleta nome e telefone: a página `/privacidade` e o texto de consentimento embaixo do botão são obrigatórios. Antes de publicar, confirme que `NEXT_PUBLIC_CONTACT_EMAIL` está preenchida. Se o dono pedir pra tirar, explique que é exigência da LGPD e ofereça encurtar o texto.

## O que NÃO mexer

- **`.env.local`:** nunca commitar, nunca imprimir no chat.
- **A lógica de UTM e envio** em `pagina-captura.tsx` e `enviar-lead.ts`.
- **RLS do `supabase-schema.sql`:** o site (chave anon) só grava; ninguém de fora lê.

## Erros comuns

| Sintoma | Causa | Correção |
|---|---|---|
| Lead não grava, console avisa "Supabase ainda não está configurado" | faltam `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` | preencher no `.env.local` e na Vercel |
| Lead não grava, sem aviso | schema não rodou | rodar o `supabase-schema.sql` (migração + `supabase db push`) |
| Webhooks: "tabelas ainda não existem" | schema antigo | aplicar o `supabase-schema.sql` de novo |
| Depois do formulário cai em página 404 | `slug` do `PaginaCaptura` diferente do nome da pasta | igualar |
| PDF dá 500 | texto sem `semAcento()` ou import errado do conteúdo | conferir o `route.ts` |
| `/admin` "Painel trancado" | falta `ADMIN_SENHA` | preencher e reiniciar / Redeploy |
| `/admin` vazio com aviso amarelo | falta `SUPABASE_SERVICE_ROLE_KEY` | preencher |
| Funciona local, não no ar | variável só no `.env.local` | cadastrar na Vercel e Redeploy |
