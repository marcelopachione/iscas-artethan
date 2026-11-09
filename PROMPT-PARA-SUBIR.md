Você vai colocar no ar o meu Sistema de Iscas + CRM de leads (Plataforma Vórtex IA). O código já está nesta pasta (a pasta `sistema-de-iscas` que eu baixei e descompactei). Leia o `README.md` e o `CLAUDE.md` daqui antes de começar.

Como trabalhar comigo:
- Eu não sou programador. Fale simples, um passo por vez, e espere eu confirmar antes de seguir.
- Você faz tudo pela linha de comando. Quando precisar que EU faça algo (criar conta, fazer login no navegador, clicar num botão), me diga exatamente onde clicar.
- NUNCA me peça pra colar senha, chave ou token aqui no chat, e nunca mostre na tela. Tudo que é secreto você grava direto no arquivo `.env.local`, sem imprimir. Nunca mostre o conteúdo do `.env.local`.
- Se algo der erro, explique em uma frase o que aconteceu e o que vamos fazer.

A ordem é: GitHub → Supabase → Vercel. Nesta ordem:

1. CONFERIR O COMPUTADOR
   - Confira se tenho Node.js 20 ou mais novo, git e as linhas de comando do GitHub (`gh`), do Supabase (`supabase`) e da Vercel (`vercel`). Se faltar algo, me diga o que é em uma frase e instale com o meu OK:
     - Mac: `brew install gh supabase/tap/supabase` e `npm install -g vercel` (sem o Homebrew, instale ele antes pelo site brew.sh).
     - Windows: `winget install GitHub.cli`, `npm install -g vercel` e, pro Supabase, `scoop install supabase` (ou use `npx supabase` no lugar de `supabase` em todos os comandos).
   - Rode `npm install`.

2. COLOCAR A MINHA CARA
   - Me pergunte: meu nome, meu @ do Instagram e se tenho selo de verificado.
   - Me peça a minha foto de perfil do Instagram (eu arrasto o arquivo aqui) e salve como `public/avatar.jpg` (quadrada, de preferência 400x400).
   - Crie o `.env.local` a partir do `.env.local.example` e preencha NEXT_PUBLIC_AUTHOR_NAME, NEXT_PUBLIC_AUTHOR_HANDLE, NEXT_PUBLIC_VERIFIED e NEXT_PUBLIC_CONTACT_EMAIL (me pergunte o e-mail de contato, ele aparece na política de privacidade).
   - Gere uma senha forte pro meu CRM e grave em ADMIN_SENHA. Me diga que ela está no `.env.local` (linha ADMIN_SENHA) e que eu abro o arquivo pra ver ou trocar; não escreva a senha no chat.

3. GITHUB (guardar o código)
   - Rode `gh auth login` e me guie no login pelo navegador (eu só clico).
   - Crie um repositório PRIVADO com o nome que eu escolher (sugira `minhas-iscas`), faça o primeiro commit e o push. Confira que o `.env.local` NÃO subiu (ele está no `.gitignore`).

4. SUPABASE (onde os leads ficam guardados), tudo pela linha de comando, sem eu entrar no painel
   - Rode `supabase login`: abre o navegador, eu crio a conta (pode ser com o GitHub) ou entro, e clico em autorizar.
   - Descubra a minha organização com `supabase orgs list`. Se eu tiver mais de uma, me pergunte qual.
   - Gere uma senha forte pro banco e grave como SUPABASE_DB_PASSWORD no `.env.local`, no mesmo comando, sem imprimir. Nos próximos comandos, leia a senha do arquivo (ex.: `$(grep '^SUPABASE_DB_PASSWORD=' .env.local | cut -d= -f2-)`), nunca digitada no comando nem mostrada.
   - Crie o projeto em São Paulo: `supabase projects create minhas-iscas --org-id {org} --region sa-east-1 --db-password {senha do .env.local}`. Anote o "reference id" do projeto (aparece no `supabase projects list`) e espere ele ficar pronto (uns 2 minutos; confira no `supabase projects list` até aparecer ACTIVE_HEALTHY).
   - Ligue esta pasta ao projeto: `supabase init` (se ainda não existir a pasta `supabase/`) e `supabase link --project-ref {ref} --password {senha do .env.local}`.
   - Crie o banco: copie o `supabase-schema.sql` pra `supabase/migrations/20260101000000_sistema_de_iscas.sql` e rode `supabase db push --password {senha do .env.local} --yes`. Tem que terminar sem erro.
   - Pegue as chaves com `supabase projects api-keys --project-ref {ref} -o json` e grave direto no `.env.local`, SEM mostrar a saída na tela (filtre o JSON num script e escreva no arquivo):
     - NEXT_PUBLIC_SUPABASE_URL = `https://{ref}.supabase.co`
     - NEXT_PUBLIC_SUPABASE_ANON_KEY = a chave `anon` (se não existir, a `publishable`)
     - SUPABASE_SERVICE_ROLE_KEY = a chave `service_role` (se não existir, a `secret`)
   - Confira que as 3 linhas ficaram preenchidas (conte os caracteres, não mostre o valor) e me explique em uma frase que a service_role é secreta e só fica no servidor.
   - Plano B, só se a linha de comando do Supabase falhar de vez: me guie no painel (supabase.com → New project em São Paulo → SQL Editor → colar o `supabase-schema.sql` e Run → Project Settings → API) e me diga em qual linha do `.env.local` eu colo cada chave. Eu colo no arquivo, nunca no chat.

5. TESTAR NO MEU COMPUTADOR
   - Rode `npm run dev`, abra `http://localhost:3000/exemplo/lead`, e me peça pra preencher com um nome e WhatsApp de teste.
   - Confira que caí na página do material e que o lead chegou no banco (consulte pela linha de comando ou pelo CRM).
   - Abra `http://localhost:3000/admin`, eu entro com a senha, e confira que o lead está no CRM.
   - Pare o servidor. Faça commit e push da pasta `supabase/migrations` (o `.env.local` continua fora).

6. VERCEL (colocar no ar com um link)
   - Rode `vercel login` e me guie no login (de preferência entrando com o GitHub).
   - Ligue o projeto (`vercel link`) e conecte ao repositório do GitHub (`vercel git connect`), pra cada `git push` publicar sozinho.
   - Cadastre na Vercel (ambiente Production) TODAS as variáveis do meu `.env.local`, MENOS a SUPABASE_DB_PASSWORD (ela só serve pra linha de comando), lendo do arquivo, sem mostrar os valores na tela.
   - Faça o deploy de produção e me entregue o link.

7. TESTAR NO AR
   - Abra `{meu-link}/exemplo/lead`, eu preencho de novo, e confira que caiu no material e no CRM (`{meu-link}/admin`).

8. CONVITE (opcional)
   - Me pergunte se quero um convite no fim do material (aula, grupo do WhatsApp, consultoria). Se sim, preencha NEXT_PUBLIC_CONVITE_URL, _SELO, _TITULO, _TEXTO e _BOTAO no `.env.local` e na Vercel, e publique de novo.

9. WEBHOOKS (opcional)
   - Me pergunte se uso alguma ferramenta que deveria receber cada lead novo (n8n, Make, Zapier, outro CRM, ferramenta de WhatsApp). Se sim, me mostre onde ela me dá a URL de webhook e me guie em `{meu-link}/admin` → Webhooks: colar a URL, clicar em "Salvar webhook" e depois em "Enviar teste" pra ver chegar lá.

10. ENTREGA
   - Me mostre um resumo: o link do site, o link da isca de exemplo, o link do meu CRM, onde está cada conta (GitHub, Supabase, Vercel) e como eu crio a próxima isca ("cria uma isca sobre {tema} pro meu público").
   - Salve esse resumo num arquivo `MEU-SISTEMA.md` nesta pasta (sem nenhuma chave nem senha dentro).
