# FastAPI Agent 开发规范包

用于指导开发人员与 AI Agent 按统一工程约束开发 FastAPI 后端。

## 技术栈
Python 3.12+、FastAPI、Pydantic v2、pydantic-settings、SQLAlchemy 2.0 AsyncSession、Alembic、PostgreSQL、pytest、Ruff。

## 使用方式
1. 将 `AGENTS.md` 放到后端项目根目录。
2. 将 `docs/` 放到项目根目录，保持文档路径。
3. 按现有项目结构迁移 `examples/` 示例，不要直接覆盖已有业务代码。
4. 在 `pyproject.toml` 锁定实际依赖版本，并配置环境变量。

## 推荐目录
```text
app/
  api/dependencies/
  api/v1/endpoints/
  core/
  domain/
  schemas/
  services/
  repositories/
  models/
  infrastructure/database/
  infrastructure/external/
  main.py
alembic/
tests/
docs/
AGENTS.md
pyproject.toml
```

## 核心约定
- Router -> Service -> Repository / Adapter。
- 第三方库通过基础设施封装层使用。
- 数据库变更通过 Alembic 管理。
- ORM Model 与 Pydantic Schema 分离。
- Service 管理业务事务，Repository 不隐式提交。
- 示例须匹配项目实际锁定版本。
