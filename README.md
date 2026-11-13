# AI Agent 工程标准库

`agent-dev-standards` 是面向 AI 编程助手的软件工程规范库，支持 React、NestJS + Prisma 和 FastAPI。

在本仓库维护公共规则和技术栈规则。项目将生成的入口和参考资料提交到自己的仓库，Agent 在普通 checkout 中即可读取。

| 目录 | 内容 |
|---|---|
| `AGENTS.md` | 标准库自身的维护入口 |
| `shared/` | 开发流程、变更边界和交付要求 |
| `frontend/react/` | React 分层、适配层和 ESLint 示例 |
| `backend/nestjs/` | NestJS 分层、DTO 和 Prisma 规范 |
| `backend/fastapi/` | FastAPI 分层、SQLAlchemy、Alembic 和测试规范 |
| `scripts/` | 初始化、同步、升级和漂移检查 |

## 接入项目

工具需要 Python 3.10+ 和 Git。把标准库检出到项目之外，将下例中的 `<cli>` 替换成该检出目录下 `scripts/agent_standards.py` 的路径，将 `<source>` 替换成标准库 Git 地址。以下命令在项目根目录运行。也可以在子命令之前加 `--project <path>`。

```sh
python "<cli>" init --source "<source>" --version v1.0.0 --stack react
python "<cli>" check
```

全栈仓库按目录选择技术栈。根入口包含通用规则，子目录入口包含该栈规则。

```sh
python "<cli>" init --source "<source>" --version v1.0.0 --scope apps/web=react --scope apps/api=nestjs-prisma --scope apps/worker=fastapi
```

已有项目先在每个受管目录将手写 `AGENTS.md` 移到同目录的 `AGENTS.local.md`。后续在本地文件里编辑项目特有约定，再运行 `sync`，生成器会把它们纳入 Agent 入口。提交配置、锁定文件、生成的 `AGENTS.md`、本地规则和整个 `.agent-standards/`。选择技术栈后可在 `agent-standards.json` 中调整目录映射，再执行 `sync`。

## 同步与升级

```sh
python "<cli>" sync
python "<cli>" upgrade --version v1.1.0
python "<cli>" check
```

- `sync` 和 `check` 从 Git 获取锁定提交，需要能够访问该源。生成的文档可离线阅读。
- `upgrade` 解析指定版本、更新锁和生成文件。审核差异后将它们作为同一次 Git 变更提交。
- 下游 CI 从受信任的固定提交检出工具并运行 `check`，同时保留项目自己的 lint、测试和构建。随标准库提供的 ESLint 示例由项目按现有配置接入。
- 同一项目的 `sync` 和 `upgrade` 应串行执行。升级中断时用相同版本重试；如果是升级 PR，可从干净 checkout 重新运行。

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
