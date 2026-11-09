# Sistema de iscas

O seu site de iscas (materiais gratuitos) pronto pra publicar. Funciona assim:

1. A pessoa comenta a palavra no seu post e recebe o link no direct.
2. Abre a página de captura: **sua foto, seu nome e seu @** no topo, e só dois campos, **Nome e WhatsApp**.
3. Clica em "Quero o material" e **o material abre na hora**, ali mesmo. Sem e-mail, sem esperar mensagem.
4. No fim do material, um **convite opcional** chama pro próximo passo: uma aula, um grupo, uma consultoria.
5. Todo contato cai no **seu CRM de leads** (`/admin`), com a jornada de cada um.

Você não precisa saber programar. **O jeito mais fácil:** abra o Claude Code nesta pasta e cole o texto do arquivo `PROMPT-PARA-SUBIR.md`. Ele faz tudo pela linha de comando, na ordem **GitHub → Supabase → Vercel**, e só te chama pra fazer login no navegador. Prefere fazer na mão? Siga os passos abaixo. Depois de configurado, quem cria as próximas iscas é o Claude Code.

Já vem com uma **isca de exemplo funcionando**: `/exemplo/lead` (captura) e `/exemplo` (material).

---

## O que você vai precisar

| O quê | Pra quê | Custo |
|---|---|---|
| [Node.js 20+](https://nodejs.org) (botão "LTS") | rodar o site no seu computador | grátis |
| [GitHub](https://github.com/signup) | guardar o código | grátis |
| [Supabase](https://supabase.com) + a [linha de comando dele](https://supabase.com/docs/guides/cli) | guardar os contatos | grátis |
| [Vercel](https://vercel.com/signup) (entre com o GitHub) | colocar o site no ar | grátis |
| [Claude Code](https://claude.com/claude-code) | criar as iscas por você | o seu plano |

---

## Antes de tudo: como abrir o terminal

O terminal é a janela onde você cola os comandos.

- **Mac:** aperte `Cmd + Espaço`, digite `Terminal` e dê Enter.
- **Windows:** aperte a tecla Windows, digite `PowerShell` e dê Enter.

Pra "entrar" na pasta do projeto, digite `cd ` (com espaço), **arraste a pasta `sistema-de-iscas` pra dentro da janela** e dê Enter. Todos os comandos daqui pra frente são rodados aí dentro.

---

## Passo 1 — Rodar no seu computador

Cole um comando por vez:

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

> No Windows, se o `cp` der erro, use `copy .env.local.example .env.local`.
> Se o `npm install` avisar de "vulnerabilities", ignore. **Não rode `npm audit fix --force`**, ele quebra o projeto.

Abra no navegador: **http://localhost:3000/exemplo/lead**

Preencha nome e WhatsApp e clique em "Quero o material". Você cai direto no material. Ainda **não grava** o contato (falta o banco, passo 4), mas já dá pra ver como tudo funciona.

Pra parar o site: clique no terminal e aperte `Ctrl + C`.

---

## Passo 2 — Colocar a sua cara (foto, nome e @)

1. **Foto:** baixe a sua foto de perfil do Instagram, deixe quadrada e salve **por cima** do arquivo `public/avatar.jpg` (mesmo nome).
2. **Nome e @:** abra o arquivo `.env.local` (no VS Code, ou no Bloco de Notas/TextEdit) e troque:

```bash
NEXT_PUBLIC_AUTHOR_NAME=Seu Nome
NEXT_PUBLIC_AUTHOR_HANDLE=@seuperfil
NEXT_PUBLIC_VERIFIED=false      # true se você tem o selo azul
```

3. Pare (`Ctrl + C`) e rode `npm run dev` de novo. Recarregue a página: já é você ali.

> Não acha o `.env.local`? Arquivos que começam com ponto ficam escondidos. No Mac, no Finder, aperte `Cmd + Shift + .` pra mostrar.

---

## Passo 3 — Subir pro GitHub

```bash
git init
git add -A
git commit -m "primeira versao"
```

Crie um repositório **vazio** em [github.com/new](https://github.com/new) (pode ser privado, não marque nenhuma opção) e rode os comandos que ele mostra, parecidos com:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git branch -M main
git push -u origin main
```

> O `.env.local` **não** vai pro GitHub (o `.gitignore` já cuida disso). É assim mesmo: as chaves você coloca na Vercel, no passo 7.

---

## Passo 4 — Criar o banco (Supabase) pela linha de comando

Você não precisa entrar no painel do Supabase: a linha de comando cria o projeto, monta o banco e pega as chaves. (É isso que o Claude faz quando você usa o `PROMPT-PARA-SUBIR.md`.)

**1. Instalar e entrar**

```bash
brew install supabase/tap/supabase     # Mac
scoop install supabase                 # Windows (ou troque "supabase" por "npx supabase" em tudo)
supabase login                         # abre o navegador: crie a conta ou entre, e autorize
```

**2. Criar o projeto em São Paulo**

```bash
supabase orgs list                     # copie o ID da sua organização
supabase projects create minhas-iscas --org-id SEU-ORG-ID --region sa-east-1 --db-password UMA-SENHA-FORTE
supabase projects list                 # espere aparecer ACTIVE_HEALTHY (uns 2 min) e copie o REFERENCE ID
```

> Guarde a senha do banco no `.env.local`, na linha `SUPABASE_DB_PASSWORD=` (ela só serve pra linha de comando; não vai pra Vercel).

**3. Montar o banco**

```bash
supabase init
supabase link --project-ref SEU-REF --password UMA-SENHA-FORTE
mkdir -p supabase/migrations
cp supabase-schema.sql supabase/migrations/20260101000000_sistema_de_iscas.sql
supabase db push --password UMA-SENHA-FORTE
```

**4. Pegar as chaves**

```bash
supabase projects api-keys --project-ref SEU-REF
```

E preencha no `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # a chave "anon" (ou "publishable", nas contas novas)
SUPABASE_SERVICE_ROLE_KEY=...         # a chave "service_role" (ou "secret"). SECRETA
```

**5. Testar:** reinicie o `npm run dev`, preencha o formulário em `/exemplo/lead` e abra o CRM (passo 5): o seu contato tem que estar lá.

> **Plano B (se a linha de comando der problema):** em [supabase.com](https://supabase.com) → **New project** (região **South America (São Paulo)**) → **SQL Editor** → **New query** → cole o `supabase-schema.sql` inteiro → **Run** ("Success"). As chaves ficam em **Project Settings → API**.

> **Sobre as chaves:** a `anon` é pública por natureza, pode ir pro navegador, porque o banco só deixa ela **gravar** contato, nunca ler. A `service_role` lê tudo: ela fica **só no servidor**, é usada pelo seu CRM e **nunca** vai no código nem pro GitHub.

> **Atualizou o sistema e o `supabase-schema.sql` mudou?** Copie de novo pra uma migração nova (ex.: `supabase/migrations/20261001000000_atualiza.sql`) e rode `supabase db push`. O arquivo pode rodar quantas vezes quiser: nada é apagado.

---

## Passo 5 — Seu CRM de leads

Escolha uma senha forte e coloque no `.env.local`:

```bash
ADMIN_SENHA=uma-senha-forte-que-so-voce-sabe
```

Reinicie e abra **http://localhost:3000/admin**. Digite a senha e você vê:

- **Visão geral:** quantos leads entraram, de onde vieram (Instagram, YouTube...), qual isca trouxe mais gente, quantos abriram o material, baixaram o PDF e clicaram no convite.
- **Leads:** a lista de todo mundo, com busca, filtros e botão **Exportar CSV** (abre no Excel/Planilhas). Clique num lead pra ver a linha do tempo, chamar no WhatsApp com um clique e anotar.
- **Pipeline:** os leads em cartões, por etapa. As três primeiras andam sozinhas (**Novo lead → Consumiu o material → Clicou no convite**). Daí pra frente você arrasta: **Em contato → Negociando → Cliente** (ou **Perdido**).
- **Webhooks:** mande cada lead novo, na hora, pra outra ferramenta (veja a seção [Webhooks](#webhooks-mande-seus-leads-pra-qualquer-lugar)).

Quer ver como fica cheio antes de ter leads? Rodando no seu computador, abra **http://localhost:3000/admin?demo=1** (dados de mentira; pra sair, `/admin?demo=0`). No site publicado a demonstração não existe.

---

## Passo 6 — Convite no fim do material (opcional)

No fim de cada material pode aparecer um bloco verde chamando pro próximo passo. Preencha no `.env.local`:

```bash
NEXT_PUBLIC_CONVITE_URL=https://link-do-seu-grupo-ou-aula
NEXT_PUBLIC_CONVITE_SELO=Aula gratuita e ao vivo
NEXT_PUBLIC_CONVITE_TITULO=Vou fazer uma aula ao vivo mostrando isso na prática.
NEXT_PUBLIC_CONVITE_TEXTO=Entra no grupo pra receber o link da aula.
NEXT_PUBLIC_CONVITE_BOTAO=Entrar no grupo
```

Deixe `NEXT_PUBLIC_CONVITE_URL` vazio e o bloco some. O convite vale pra **todas** as iscas de uma vez e também sai no fim do PDF.

---

## Passo 7 — Colocar no ar (Vercel)

1. Entre em [vercel.com/new](https://vercel.com/new) e escolha o repositório que você criou.
2. Antes de clicar em Deploy, abra **Environment Variables** e cadastre **as mesmas linhas do seu `.env.local`** (nome à esquerda, valor à direita), menos a `SUPABASE_DB_PASSWORD`. Dica: dá pra colar o arquivo inteiro de uma vez.
3. Clique em **Deploy** e espere uns 2 minutos.

Pronto: o site está no ar (algo como `seu-projeto.vercel.app`). Teste `seu-projeto.vercel.app/exemplo/lead` e `seu-projeto.vercel.app/admin`.

A partir daqui, **todo `git push` publica sozinho**.

> Mudou uma variável na Vercel? Ela só vale depois de publicar de novo: **Deployments** → o último → `...` → **Redeploy**.

---

## Passo 8 — Criar a sua primeira isca

Abra o Claude Code dentro da pasta do projeto e peça:

```
cria uma isca sobre {seu tema}. A palavra do comentário vai ser {PALAVRA}.
O vídeo prometeu: {o que você prometeu entregar}.
```

O `CLAUDE.md` deste projeto ensina o Claude a fazer o resto: pesquisar o tema em fontes reais, escrever o material, criar as páginas, testar no seu computador e publicar. No final ele te entrega o link certo pra colocar na automação de direct, já com a marcação de origem.

---

## Webhooks: mande seus leads pra qualquer lugar

Webhook é um "aviso automático": toda vez que entra um lead, o seu site manda os dados dele pra um endereço que você escolheu. Com isso o lead cai sozinho no seu n8n, Make, Zapier, outro CRM ou planilha.

**Como ligar**

1. Na sua ferramenta, crie um gatilho de webhook e copie a URL que ela te dá:
   - **n8n:** nó **Webhook**, método `POST` (use a "Production URL" e ative o fluxo).
   - **Make:** módulo **Webhooks → Custom webhook** → **Add** → copie o endereço.
   - **Zapier:** gatilho **Webhooks by Zapier → Catch Hook**.
2. No seu CRM, abra **/admin → Webhooks**, cole a URL e escolha quando mandar: **Lead novo** (já vem marcado) e, se quiser, **Lead mudou de etapa** (quando você move o lead no Pipeline).
3. Clique em **Salvar webhook** e depois em **Enviar teste**. Um lead de mentira ("Lead de Teste") chega na sua ferramenta, e ela já aprende o formato.

Embaixo aparecem as **últimas entregas**: deu certo (✓ e o código, ex.: 200) ou deu erro (✕, com o motivo). Se a ferramenta não responder, o site tenta de novo uma vez. **Se o webhook falhar, o lead não é perdido:** ele continua salvo no seu CRM e a pessoa recebe o material normalmente.

**O que chega na sua ferramenta** (um `POST` em JSON):

```json
{
  "evento": "lead.novo",
  "enviado_em": "2026-10-01T14:03:00.000Z",
  "lead": {
    "id": "6f1c...",
    "nome": "Ana Souza",
    "whatsapp": "+5511912345678",
    "link_whatsapp": "https://wa.me/5511912345678",
    "isca": "exemplo",
    "etapa": "novo",
    "criado_em": "2026-10-01T14:02:58.000Z",
    "utm_source": "instagram",
    "utm_medium": "reels",
    "utm_campaign": "exemplo",
    "utm_content": "01-10"
  }
}
```

No evento `lead.etapa` vem também `"etapa_anterior"`. No teste, `"evento": "teste"`.

**Assinatura (opcional, pra ninguém se passar pelo seu site)**

Preencha o campo **Segredo** (ou clique em **Gerar**). Aí todo envio leva o cabeçalho `X-Webhook-Assinatura: sha256=...`, que é o HMAC-SHA256 do corpo da mensagem com o seu segredo. Pra conferir do outro lado (Node.js, ou um nó **Code** do n8n):

```js
const crypto = require("crypto");
const esperado = "sha256=" + crypto.createHmac("sha256", "SEU-SEGREDO").update(corpoCruDaRequisicao).digest("hex");
const confere = esperado === cabecalhos["x-webhook-assinatura"];
```

No Make e no Zapier, se você não for conferir, pode deixar sem segredo.

> **Quer disparar mensagem no WhatsApp?** Ligue um webhook na sua ferramenta de WhatsApp. O sistema não manda WhatsApp sozinho (isso depende de uma integração paga).

<details>
<summary>Como funciona por dentro (pra quem tem curiosidade)</summary>

Quem envia é o servidor do seu site (`app/lib/webhooks.ts`), não o navegador da pessoa: o segredo nunca sai do servidor. Depois que o lead é gravado, a página avisa `/api/webhooks/lead-novo` (um aviso que sobrevive à troca de página); se a captura foi pelo caminho alternativo (`/api/lead`), o próprio servidor avisa. A resposta pra pessoa nunca espera o webhook: o envio roda em segundo plano (`after`, da Vercel). Cada lead é mandado **uma vez só** (o servidor marca `webhook_avisado_at` antes de enviar) e, se algum aviso se perder, o próximo lead (ou abrir a tela de Webhooks) manda os que ficaram pra trás nas últimas 24 horas. A troca de etapa no Pipeline avisa direto do servidor.
</details>

---

## Como o projeto é organizado

```
app/
  exemplo/                   isca de exemplo (use como molde)
    conteudo.ts              o texto do material (página e PDF leem daqui)
    page.tsx                 a página do material   → /exemplo
    lead/page.tsx            a página de captura    → /exemplo/lead
  api/exemplo-pdf/route.ts   o PDF                  → /api/exemplo-pdf
  components/                peças reaproveitadas (formulário, convite, cabeçalho...)
  admin/                     o seu CRM de leads     → /admin (visão geral, leads, pipeline, webhooks)
public/avatar.jpg            a sua foto de perfil
supabase-schema.sql          o banco (o Claude aplica pela linha de comando)
.env.local.example           o modelo das suas configurações
CLAUDE.md                    instruções pro Claude Code
INDICE-CTAS.md               as palavras de comentário que você já usou
```

---

## Perguntas frequentes

**Preciso de domínio próprio?** Não. A Vercel te dá um endereço grátis. Se quiser o seu (ex: `materiais.seusite.com`), é em Project → Settings → Domains.

**Quanto custa?** Zero pra começar. Os planos grátis de Supabase e Vercel aguentam bem os primeiros milhares de leads.

**Preenchi o formulário e o contato não apareceu.** Confira as três chaves do Supabase no `.env.local` (e na Vercel, no site publicado) e se o `supabase-schema.sql` rodou com "Success". Sem o banco, o site deixa a pessoa ver o material mesmo assim e avisa no console do navegador que o contato não foi salvo.

**O /admin diz "Painel trancado".** Falta a `ADMIN_SENHA` (no `.env.local` ou na Vercel).

**O /admin abre mas aparece vazio com um aviso amarelo.** Falta a `SUPABASE_SERVICE_ROLE_KEY` (ou a URL do Supabase).

**O PDF deu erro.** Peça pro Claude conferir: quase sempre é caractere especial no texto do material.

**O webhook não chegou na minha ferramenta.** Abra **/admin → Webhooks** e veja as últimas entregas: o motivo do erro aparece lá. Confira se a URL está certa, se o fluxo está ativo (no n8n, a "Production URL" só funciona com o fluxo ativo) e clique em **Enviar teste**. Se aparecer que as tabelas não existem, rode o `supabase-schema.sql` de novo (passo 4).

**Esqueci a senha do painel.** Troque a `ADMIN_SENHA` (e na Vercel, com Redeploy). Trocar a senha desconecta todo mundo que estava logado.
