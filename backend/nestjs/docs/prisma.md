# Prisma ORM 使用规范

## 统一入口
- 全项目通过 Nest DI 注入统一 PrismaService。
- PrismaClient 创建、连接和关闭集中在 `src/database/`。
- 业务模块禁止 `new PrismaClient()`。
- 单数据库通常使用一个 PrismaService；多数据库必须明确命名、连接和事务边界。

## Schema
- `schema.prisma` 是模型定义事实来源。
- 字段、关系、索引、唯一约束和删除行为必须按业务生命周期设计。
- 常用过滤、关联和唯一查询字段评估索引。
- 时间统一按 UTC 存储，API 明确时区和格式。
- 金额使用 Decimal 或最小货币单位整数，不用 Float/Double 做精确财务计算。
- 多租户项目必须在数据访问层强制租户隔离，不能只信任客户端传入租户 ID。
- 软删除必须定义统一规则，避免查询遗漏过滤条件。

## Migration
开发流程：
1. 修改 Schema。
2. `prisma format`、`prisma validate`。
3. `prisma migrate dev --name <description>` 创建迁移。
4. 检查生成 SQL，确认没有意外删除、重建或数据丢失。
5. 生成 Client 并运行测试。

生产流程：
- 使用 `prisma migrate deploy` 部署已审核迁移。
- 生产禁止 `prisma migrate dev`。
- 不把 `prisma db push` 当作生产发布流程。
- 破坏性变更使用分阶段迁移，先兼容新增、迁移数据、切换代码，再清理旧字段。
- 迁移前确认备份和恢复方案。

## 查询
- 优先 `select` 需要字段，谨慎使用大范围 `include`。
- 列表必须分页并限制最大 pageSize。
- 排序字段使用白名单映射。
- 避免 N+1，必要时批量查询。
- 大数据量任务评估游标分页和批处理。
- 禁止将用户输入拼接进 `$queryRawUnsafe`；原生 SQL 优先参数化 `$queryRaw` 并说明原因。

## 事务与并发
- 多步且要求一致性的写操作使用 `$transaction`。
- 事务中避免耗时外部 HTTP 调用。
- 库存、余额、积分等并发敏感字段使用条件更新、原子操作、唯一约束或适当隔离级别。
- 事务失败必须传播异常；重试需评估幂等性。

## 错误与版本
- 集中映射已知 Prisma 错误码，如唯一约束冲突 P2002、记录不存在 P2025。
- 未知异常交给统一异常处理，不返回 SQL/连接信息。
- `prisma` 与 `@prisma/client` 版本按项目要求匹配。
- 升级前阅读对应主版本迁移指南；Prisma 7 的配置/Adapter 方式可能与旧版不同，不可盲目复制旧示例。
