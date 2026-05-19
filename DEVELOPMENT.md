# Processo de Desenvolvimento — Coopers Challenge

## Visão Geral

O desafio consistia em reconstruir um layout fornecido como uma aplicação full-stack completa: autenticação de usuários, lista de tarefas com persistência, drag-and-drop, carrossel e formulário de contato com envio de e-mail. Optei por manter tudo em um único repositório Next.js 16, aproveitando as API Routes para o backend em vez de criar um servidor separado.

---

## Processo de Desenvolvimento

### 1. Estrutura e stack

A primeira decisão foi escolher o stack. Next.js 16 com App Router entregava frontend e backend no mesmo projeto, o que simplificava o deploy e eliminava a necessidade de configurar CORS. Para o banco de dados escolhi PostgreSQL hospedado no Neon (serverless), acessado via TypeORM 0.3 com migrations versionadas.

A organização das rotas seguiu o padrão `/api/v1/...` para deixar explícito o versionamento da API desde o início.

### 2. Autenticação

Implementei autenticação stateless com JWT armazenado em cookie `httpOnly`. Essa abordagem evita que o token fique exposto ao JavaScript do cliente (proteção contra XSS) e permite que o middleware do Next.js valide a sessão antes de renderizar páginas protegidas. O hash de senha usa bcryptjs com salt automático.

### 3. To-do List

A lista de tarefas foi dividida em duas colunas — pendentes e concluídas — com edição inline ao clicar no texto, check/uncheck e exclusão ao hover. A ordenação das tarefas é persistida no banco por um campo `order` inteiro, atualizado a cada reordenação via drag-and-drop.

### 4. Drag-and-Drop

Utilizei `@dnd-kit/core` + `@dnd-kit/sortable`. Além do sensor de mouse padrão, adicionei `TouchSensor` com delay de ativação para distinguir scroll de arrasto em dispositivos móveis — sem isso, qualquer scroll na lista ativava o drag acidentalmente.

### 5. Carrossel e layout

A seção "Good Things" usa um carrossel horizontal com navegação por dots, construído sem biblioteca externa para manter o bundle enxuto. O layout geral seguiu o design fornecido com Tailwind CSS v4, incluindo a cor verde da marca (`#4AC959`) extraída do SVG do logo.

### 6. Formulário de contato

O envio de e-mail usa a API do Resend. A instância do cliente Resend é criada dentro do handler da rota (lazy init) em vez de no escopo do módulo — decisão explicada na seção de dificuldades abaixo.

---

## Dificuldades e Soluções

### TypeORM + Turbopack: conflito com decorators

**Problema:** TypeORM usa decorators do TypeScript (`@Entity`, `@Column`, etc.) que dependem de `emitDecoratorMetadata`. O Turbopack (compilador padrão do Next.js 16) não suporta essa flag via SWC sem configuração adicional de Babel, o que gerava erros de build.

**Solução:** Substituí todos os decorators pelo `EntitySchema` do TypeORM. Em vez de:

```ts
@Entity()
export class User { ... }
```

passei a usar:

```ts
export const UserSchema = new EntitySchema<User>({ ... })
```

Isso elimina completamente a dependência de `emitDecoratorMetadata` e funciona sem nenhuma alteração no compilador.

---

### Resend: erro na inicialização do módulo

**Problema:** Instanciar o cliente Resend no escopo do módulo (`const resend = new Resend(process.env.RESEND_API_KEY)`) causava erro durante o build, pois a variável de ambiente não está disponível naquele momento.

**Solução:** Mover a criação da instância para dentro do handler da rota POST:

```ts
export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY); // lazy init
  ...
}
```

Assim a instância só é criada em runtime, quando a variável já está disponível.

---

### Drag-and-drop em mobile

**Problema:** O `PointerSensor` padrão do @dnd-kit ativava o drag ao mínimo movimento, tornando impossível fazer scroll vertical na lista de tarefas em dispositivos touch.

**Solução:** Adicionar `TouchSensor` com `activationConstraint: { delay: 250, tolerance: 5 }`. O delay de 250 ms garante que toques rápidos e swipes sejam interpretados como scroll, enquanto pressionar e segurar ativa o drag.

---

## Considerações Finais

O maior aprendizado deste desafio foi lidar com as restrições do Turbopack em um projeto que usa TypeORM — uma combinação que ainda tem pouca documentação oficial. A abordagem com `EntitySchema` resolveu o problema de forma limpa e sem comprometer a tipagem.
