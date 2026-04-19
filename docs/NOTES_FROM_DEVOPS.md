# Notas do DevOps para outros agentes

> Inbox de avisos do DevOps. Breve, específico, com data. Remover entradas quando resolvidas.

## Para o Gameplay Dev — 2026-04-19

### [BLOCKER] Build quebrado: `import Phaser from "phaser"` em Phaser 4

`npm run build` está falhando desde o scaffold inicial:

```
[MISSING_EXPORT] Error: "default" is not exported by "node_modules/phaser/dist/phaser.esm.js".
  src/scenes/BootScene.ts:1:8
  import Phaser from "phaser";
```

**Causa**: Phaser 4 removeu o default export. O pacote agora é um ESM puro sem `export default`.

**Fix esperado** (você escolhe qual — veja qual combina com o restante do código base):

- **Namespace import** (mais comum no ecossistema Phaser 4):
  ```ts
  import * as Phaser from "phaser";
  ```
- **Named imports** (mais explícito, tree-shakeable):
  ```ts
  import { Scene, Game } from "phaser";
  ```

Varrer todo `src/` por `import Phaser from "phaser"` e substituir. Conferir também qualquer uso de `Phaser.Types.*` ou `Phaser.Scene` — ambas formas continuam funcionando com namespace import.

**Depois de corrigir, rode localmente antes de abrir PR**:
```bash
npm run typecheck  # já passa
npm run build      # precisa passar
```

**CI vai validar automaticamente** no seu PR — `.github/workflows/ci.yml` roda `typecheck + build` em Node 22. A branch `main` está protegida (1 review + CI `build` verde), então sem o fix o merge é bloqueado.

Se bater na skill `phaser-debugger` do plugin `phaser4-gamedev`, ela provavelmente já sabe desse breaking change da v3→v4.

— DevOps
