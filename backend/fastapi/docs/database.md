# 数据库与 SQLAlchemy 规范

## 基础约定
- PostgreSQL 为默认关系型数据库。
- 使用 SQLAlchemy 2.0 风格：Mapped、mapped_column、select。
- 统一 Engine、连接池与 Session 生命周期。
- 每个请求注入独立 AsyncSession，不跨请求复用。
- 连接字符串由配置模块提供，不硬编码。

## Model 与查询
- 主键、外键、唯一约束、索引和删除策略显式定义。
- 金额使用 Numeric / Decimal，时间使用 timezone-aware datetime。
- 避免无业务价值的过度 ORM 关系；加载策略显式选择。
- 关键约束落在数据库层，不能只依赖应用校验。
- 对关联数据使用 selectinload / joinedload 等策略，防止 N+1。
- 分页必须有稳定排序；大数据量评估游标分页。
- SQL 使用绑定参数，不拼接用户输入。

## 事务与并发
- Service 定义一个业务用例的事务边界。
- Repository 不自行 commit；统一由调用方控制 commit / rollback。
- 多表更新、余额、积分、库存等场景考虑并发竞争。
- 使用数据库约束、条件更新、行锁或乐观锁解决并发问题。
- 外部 API 调用通常不应放在长事务中；必要时采用 Outbox / 补偿机制。

## Alembic Migration
- 模型变更必须配套 migration。
- autogenerate 生成后人工检查类型、默认值、索引、约束和数据迁移逻辑。
- 生产执行 `alembic upgrade head`，不得在应用启动时自动改表。
- 删除字段或收紧约束采用分阶段发布：先兼容、迁移数据、再移除旧结构。
- migration 应可审查、可重复部署；避免依赖本地数据状态。
- 生产数据修复脚本需评审、备份并记录执行结果。

## 数据精度
- 金额使用 Decimal / Numeric 或最小货币单位整数，禁止 float 精确累计。
- 时间统一存 UTC；明确业务日期与时区边界。
