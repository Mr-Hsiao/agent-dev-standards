# FastAPI Agent 开发规范

## 1. 技术栈基线
- Python 3.12+
- FastAPI、Pydantic v2、pydantic-settings
- SQLAlchemy 2.0（AsyncSession）、Alembic
- PostgreSQL
- pytest、pytest-asyncio、httpx
- Ruff；类型检查按项目选定 mypy 或 pyright

所有依赖必须在 `pyproject.toml` 声明并锁定可复现版本。

## 2. 架构与依赖方向
统一采用 `API Router -> Application Service -> Repository / Adapter -> Infrastructure`。
- Router 只处理 HTTP 输入输出、依赖注入和状态码，不写业务规则、不直接访问 ORM。
- Service 编排业务流程、业务规则和事务边界。
- Repository 封装持久化查询；不强制每张表都创建 Repository。
- Adapter 封装外部服务、消息队列、文件存储、邮件、支付等第三方能力。
- Domain / schemas 不应依赖 FastAPI、SQLAlchemy 等基础设施实现。
- 依赖向内流动，禁止循环依赖。

## 3. 第三方库封装
- 第三方库经由 `infrastructure/` 或 `adapters/` 统一封装。
- 业务代码不得散落创建第三方 SDK 客户端或拼接底层请求。
- 统一管理生命周期、超时、重试、连接池、日志和异常转换。
- 封装围绕稳定业务能力，不为每个函数机械增加 wrapper。
- 更换实现时优先只修改适配层；不得复制第三方库全部 API。

## 4. API 与数据校验
- 所有请求输入使用 Pydantic DTO；禁止直接把 ORM Model 当作 API 契约。
- 显式声明响应模型，避免暴露内部字段。
- 路由使用 `/api/v1` 前缀；破坏性变更使用新版本。
- 列表接口统一分页参数与响应结构，并限制 page_size 最大值。
- 时间使用带时区的 UTC datetime；金额使用 Decimal 或最小货币单位整数，禁止 float 金额计算。
- 对外错误不得泄露 SQL、堆栈、密钥或内部路径。

## 5. 数据库
- 统一通过 `get_db_session` 注入 AsyncSession。
- 禁止业务模块自行创建 Engine、Session 或调用 `create_async_engine`。
- Schema 变更通过 Alembic migration；禁止将 `metadata.create_all()` 用作生产迁移。
- 事务边界由 Service 明确管理；Repository 不隐式提交。
- 注意 N+1、分页稳定排序、连接池、并发更新和唯一约束。
- 生产迁移先评估兼容性，采用可回滚或向前修复策略。

## 6. 安全
- 配置和密钥从环境变量或密钥管理服务读取，不得提交 Git。
- 写接口执行身份认证与权限校验；认证不等于授权。
- 密码使用安全密码哈希，不得明文或可逆加密保存。
- 登录、验证码、导出、上传等高风险接口实施限流和审计。
- 文件上传校验大小、类型、文件名和存储路径。
- SQL 使用参数化查询；生产 CORS 只允许可信 Origin。

## 7. 异常与日志
- 业务异常使用统一异常类型和错误码。
- 全局异常处理器统一转换为标准 JSON。
- 不允许吞掉异常；日志使用结构化字段。
- 不记录密码、Token、身份证号等敏感信息。
- 请求日志包含 request_id / trace_id。

## 8. 测试与质量
- 新增业务逻辑必须有单元测试；关键 API 必须有集成测试。
- 测试不得连接生产数据库或真实第三方服务。
- 外部服务通过 Adapter mock；数据库使用独立测试库或事务隔离。
- 提交前执行 lint、format check、type check（若启用）和 tests。
- 修复 Bug 先增加复现问题的回归测试。

## 10. 禁止事项
- Router 中写 SQL 或复杂业务逻辑。
- 业务模块直接实例化第三方 SDK / 数据库 Engine。
- 使用全局可变 Session，或在异步请求中执行长时间阻塞 I/O。
- 未审核直接发布自动生成的 migration。
- 将 ORM 对象、异常堆栈或内部配置直接返回客户端。
- 未经确认大规模重构、升级依赖主版本或改变技术栈。
