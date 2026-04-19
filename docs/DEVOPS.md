# DevOps — Os Cabra

> **Responsável**: DevOps (acionado na fase de deploy). **Lê também**: Gameplay Dev.
> **Depende de**: projeto já no GitHub.

## 1. Repositório

- **Host**: GitHub
- **Owner**: `giordanorec`
- **Nome**: `os-cabra` (sugestão — confirmar com o usuário)
- **Visibilidade**: privado inicialmente, abrir pra público quando estiver apresentável
- **Branch principal**: `main`
- **Branches de feature**: `feat/nome-da-feature`, merged via PR
- **Proteção de main**: exigir 1 revisão em PR e CI verde (quando CI existir)

## 2. Versionamento

- **Semver** relaxado: `v0.X.Y` até MVP. `v1.0.0` no primeiro release público
- Tag a cada milestone: `v0.1.0-milestone-1`, etc.
- Changelog em `CHANGELOG.md` na raiz (opcional no começo, vira útil perto do lançamento)

## 3. Build

```bash
npm ci            # instalação limpa (CI)
npm run typecheck # check TS
npm run build     # gera dist/
```

Output: `dist/` contém `index.html`, `assets/*.js`, `assets/*.css`, sprites/sons em `assets/`.

## 4. Deploy — opções

### 4.1 Itch.io (recomendado pra jogo indie)

**Prós**: comunidade de jogos, fácil pra amigos baixarem, gratuito, páginas bonitas  
**Contras**: precisa upload manual (ou usar `butler` CLI)

**Setup**:
```bash
# Instalar butler (CLI do itch.io)
curl -JL https://broth.itch.zone/butler/linux-amd64/LATEST/archive/default -o butler.zip
unzip butler.zip && chmod +x butler && sudo mv butler /usr/local/bin/

# Login uma vez
butler login

# Deploy
cd dist && zip -r ../os-cabra-web.zip . && cd ..
butler push os-cabra-web.zip giordanorec/os-cabra:web
```

### 4.2 Vercel (recomendado pra deploy contínuo)

**Prós**: deploy automático a cada push na `main`, URL bonita, HTTPS grátis, CDN global  
**Contras**: requer configuração de DNS se quiser domínio custom

**Setup**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

Ou conectar o repo via GUI do vercel.com — mais simples, faz deploy automático.

**`vercel.json`** na raiz:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

### 4.3 GitHub Pages (mais simples, sem CI)

Usa `gh-pages` branch. Menos flexível mas zero configuração:

```bash
npm i -D gh-pages
# em package.json:
# "deploy:gh": "npm run build && gh-pages -d dist"
npm run deploy:gh
```

**Recomendação**: começar com **Vercel** (deploy automático via push é mais confortável pra iterar), e publicar também no **itch.io** quando tiver apresentável (mais visibilidade na comunidade indie).

## 5. CI (futuro)

Um `.github/workflows/ci.yml` simples pra rodar em cada PR:

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run build
```

Adicionar quando o Gameplay Dev fizer o primeiro PR "de verdade". Sem pressa.

## 6. Secrets

Nada de segredo esperado na v1 (sem backend, sem API key em runtime).

Se usarmos Gemini API via script local pra gerar arte, chave fica em `.env` (já no `.gitignore`). Documentar em `docs/AI_SETUP.md` se surgir.

## 7. Release checklist

Antes de tagar `v0.1.0-milestone-1` (MVP de 1 fase):

- [ ] `npm run typecheck` limpo
- [ ] `npm run build` sem warnings relevantes
- [ ] Playtest completo passou (QA_PLAN.md smoke + regression)
- [ ] README atualizado com instruções
- [ ] CHANGELOG atualizado
- [ ] `dist/` testado via `npm run preview` em Chrome e Firefox
- [ ] Deploy feito em Vercel ou itch.io
- [ ] Tag criada: `git tag v0.1.0-milestone-1 && git push --tags`

## 8. Entregáveis do DevOps

1. **Repositório GitHub** configurado com branch protection, .github/workflows/ci.yml, issue/PR templates opcionais
2. **Deploy funcional** em pelo menos 1 plataforma (Vercel preferido)
3. **Documentação de deploy** — como o usuário pode republicar se precisar
4. **Release process** — instruções curtas pra tagar + deployar

## 9. Open questions

- [ ] Vamos querer CI desde o milestone 1 ou deixar pra mais tarde?
- [ ] Deploy só no Vercel, só no itch.io, ou ambos?
- [ ] Domínio custom (`oscabra.com` ou similar) ou fica em vercel.app mesmo?
