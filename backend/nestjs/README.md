# NestJS + Prisma Agent 开发规范包

## 文件结构
- `AGENTS.md`：Agent 强制开发规则
- `docs/architecture.md`：目录、分层和依赖方向
- `docs/development.md`：NestJS 编码、API、测试规范
- `docs/prisma.md`：Prisma Schema、查询、事务和 Migration 规范
- `docs/security.md`：认证、授权、配置和日志规范
- `examples/`：PrismaService、模块、DTO 和 Schema 示例

## 放入现有项目
1. 将 `AGENTS.md` 放到 NestJS 项目根目录。
2. 将 `docs/` 放到项目根目录。
3. `examples/` 仅作为参考，结合当前 NestJS、Prisma 主版本和数据库配置迁移。
4. 检查项目是否已有 PrismaModule/PrismaService，避免重复创建客户端。
5. 将 Migration 纳入开发、测试和生产发布流程。

## 核心原则
Controller 不直接访问数据库；Service 负责业务用例；PrismaService 统一管理 Prisma Client；复杂数据访问才增加 Repository；所有外部输入通过 DTO 校验；Prisma Model 不直接作为 API 契约。

## 版本提醒
Prisma 不同主版本的配置、生成器、连接器和客户端导入方式可能不同。示例仅作结构参考，必须以项目锁定版本为准，尤其不要将旧版 Prisma 示例不加检查地复制到 Prisma 7 项目。
