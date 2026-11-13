# 开发规范

## Python 代码风格
- 使用 4 空格缩进，遵循 PEP 8。
- 公共函数、类和复杂逻辑添加类型标注。
- 优先使用明确类型、Enum、dataclass 或 Pydantic 模型，避免无约束 dict。
- 异步调用链保持一致；异步路由不得直接执行长时间同步 I/O。
- 函数保持单一职责，避免过长函数和隐式副作用。
- 使用依赖注入，不通过模块级全局变量保存请求级状态。

## Router
- 只处理 HTTP 层工作，通过 Depends 注入 Service、当前用户和数据库会话。
- 使用 response_model 明确响应结构，显式声明成功状态码。
- 不返回 ORM 对象作为隐式 API 契约。
- 路由按业务资源组织，避免单文件包含全部接口。

## Pydantic Schema
- 请求、响应模型分开定义。
- Pydantic v2 使用 `ConfigDict(from_attributes=True)` 读取 ORM 属性。
- 使用 Field 定义长度、范围和说明。
- 更新 DTO 区分字段未传与字段传 null 的语义。
- 对枚举、日期、金额等字段定义明确校验规则。

## Service 与 Repository
- Service 表达业务用例，不依赖 FastAPI Request、HTTPException 等 HTTP 对象。
- 业务失败转换为项目定义的业务异常。
- Service 明确事务边界；Repository 不自行 commit。
- Repository 方法名表达意图，如 get_by_id、list_active。
- 复杂查询集中管理；不为每张表机械创建 Repository。

## API 约定
- 统一前缀 `/api/v1`，资源路径使用名词，HTTP 方法表达动作。
- 列表分页统一使用 page、page_size，并限制最大 page_size。
- 对外接口保持向后兼容；破坏性变更提升 API 版本。
- 日期时间使用 ISO 8601 并带时区；内部统一 UTC。
- OpenAPI 文档应与实际响应一致。

## 异步约定
- `async def` 不代表所有代码自动异步。
- AsyncSession 查询必须 await；共享 AsyncSession 不得跨并发任务同时使用。
- 阻塞式文件、网络或 CPU 密集任务不得直接阻塞事件循环。
- 不要在异步请求中调用 asyncio.run()。

## 配置
- 使用 pydantic-settings 管理配置。
- 开发、测试、生产不得共用敏感配置。
- `.env` 仅用于本地开发，不提交真实密钥。
- 启动时校验必需配置，缺失时快速失败。
