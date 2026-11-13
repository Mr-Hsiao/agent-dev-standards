# AI Agent 工程标准库

`agent-dev-standards` 是面向 AI 编程助手的软件工程规范库，支持 React、NestJS + Prisma 和 FastAPI。

在本仓库维护公共规则和技术栈规则。项目将生成的入口和参考资料提交到自己的仓库，Agent 在普通 checkout 中即可读取。

| 目录 | 内容 |
|---|---|
| `AGENTS.md` | 标准库自身的维护入口 |
| `shared/` | 开发流程、变更边界和交付要求 |
| `frontend/react/` | React 开发规范 |
| `backend/nestjs/` | NestJS 分层、DTO 和 Prisma 规范 |
| `backend/fastapi/` | FastAPI 分层、SQLAlchemy、Alembic 和测试规范 |
| `scripts/` | 初始化、同步、升级和漂移检查 |

## 接入项目

1. 安装 Git 和 Python 3.10+，运行 `git --version` 和 `python --version` 确认可用。如果系统使用 `python3`，将下文的 `python` 换成 `python3`。
2. 在项目根目录打开终端，克隆首版工具到项目的同级目录。

   ```sh
   git clone --branch v1.0.0 https://github.com/Mr-Hsiao/agent-dev-standards.git ../agent-dev-standards
   ```

3. 如果项目已有手写的 `AGENTS.md`，将内容迁到同目录的 `AGENTS.local.md`，并移走原文件。全栈项目在根目录及每个受管子目录执行同样的迁移。
4. 选一条与你项目对应的命令，在项目根目录执行。

   ```sh
   # React
   python ../agent-dev-standards/scripts/agent_standards.py init --source https://github.com/Mr-Hsiao/agent-dev-standards.git --version v1.0.0 --stack react

   # NestJS + Prisma
   python ../agent-dev-standards/scripts/agent_standards.py init --source https://github.com/Mr-Hsiao/agent-dev-standards.git --version v1.0.0 --stack nestjs-prisma

   # FastAPI
   python ../agent-dev-standards/scripts/agent_standards.py init --source https://github.com/Mr-Hsiao/agent-dev-standards.git --version v1.0.0 --stack fastapi
   ```

   全栈仓库执行一次多目录初始化，将目录替换为实际路径。

   ```sh
   python ../agent-dev-standards/scripts/agent_standards.py init --source https://github.com/Mr-Hsiao/agent-dev-standards.git --version v1.0.0 --scope apps/web=react --scope apps/api=nestjs-prisma --scope apps/worker=fastapi
   ```

5. 验证并将 `agent-standards.json`、`agent-standards.lock.json`、生成的根和子目录 `AGENTS.md`、已有的 `AGENTS.local.md` 及整个 `.agent-standards/` 提交到项目 Git。开发时从项目根目录启动 Agent，项目的 `AGENTS.md` 提供规则入口。

   ```sh
   python ../agent-dev-standards/scripts/agent_standards.py check
   git status --short
   ```

## 同步与升级

修改 `AGENTS.local.md` 或配置中的目录映射后，运行以下命令重新生成并校验。

```sh
python ../agent-dev-standards/scripts/agent_standards.py sync
python ../agent-dev-standards/scripts/agent_standards.py check
```

升级时，运行 `git ls-remote --tags https://github.com/Mr-Hsiao/agent-dev-standards.git` 查看已发布的标签。将下方的 `VERSION` 替换为目标标签。

```sh
python ../agent-dev-standards/scripts/agent_standards.py upgrade --version VERSION
python ../agent-dev-standards/scripts/agent_standards.py check
git status --short
```

- `sync` 和 `check` 从 Git 获取锁定提交，需要访问标准库源。生成的文档可离线阅读。
- 审核升级差异，将更新后的锁和生成文件作为同一次 Git 变更提交。
- 在下游 CI 中检出固定版本的工具并运行 `check`。同一项目的 `sync` 和 `upgrade` 应串行执行。

## 发布与批量更新

将标准库变更合并后更新 `CHANGELOG.md`，创建并推送版本 tag。保留已发布 tag 和历史提交供下游读取。下游自动化以该 tag 为输入，在登记的项目中运行 `upgrade` 和 `check`，把生成的差异提交为独立 PR。项目通过原有 CI 和评审后合并。批量 PR 由实际 Git 托管平台配置。

## 工程质量检查

CI 运行 `check` 校验项目的规范文件和版本锁。业务代码的检查由项目 CI 按技术栈运行。

| 技术栈 | 接入方式 |
|---|---|
| React | 把 `.agent-standards/frontend/react/eslint.import-restrictions.example.js` 中的导入限制合并到现有 ESLint 配置，运行 lint 和类型检查。 |
| NestJS + Prisma | 在现有 ESLint 配置中限制 Controller 导入 Prisma Client 或 PrismaService，运行 lint、测试及项目的 Prisma schema 校验。 |
| FastAPI | 运行 Ruff 和 pytest。为关键 API 增加集成测试，用项目选定的依赖边界检查约束 Router 对持久化层的导入。 |

依赖升级随业务 PR 审查。PR 改动依赖声明或锁文件时，说明依赖用途、版本变化和验证结果。已有违规的项目可先记录基线，在 CI 拦截新增违规。


### React ESLint 配置

在已有 ESLint flat config 的 React 项目中，从生成的文件导入规则，在原有 TS/TSX 配置项之后展开。下面是项目根目录 `eslint.config.js` 使用 ESM 时的写法，`existingConfigs` 代表项目已有的配置项。

```js
import { adapterImportRestrictions } from './.agent-standards/frontend/react/eslint.import-restrictions.example.js';

export default [
  ...existingConfigs,
  ...adapterImportRestrictions,
];
```

运行项目已有的 lint 命令。示例针对 `src/` 下的 TS/TSX 静态导入，包含包入口和子路径。项目使用不同源码目录时，将示例中的路径按实际目录调整。若已有配置也设置了 `no-restricted-imports`，合并双方的限制，因为后匹配的同名规则会覆盖前面的配置。
