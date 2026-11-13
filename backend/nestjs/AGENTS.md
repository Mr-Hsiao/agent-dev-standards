# AGENTS.md — NestJS + Prisma Agent 开发规则

## 技术栈
- Node.js、NestJS、TypeScript、Prisma ORM。
- 数据库以项目现有配置为准，不得擅自更换数据库、ORM 或升级主版本。

开发前检查现有模块、鉴权、验证、拦截器、Prisma Schema、响应及命名约定。确认已有模型和表后再新增。

## 分层规则
请求链路：`Controller -> Service -> PrismaService / Repository -> Database`
- Controller：只处理 HTTP 路由、参数绑定和调用 Service。
- Service：组织业务用例、业务规则和事务边界。
- Repository：复杂或复用的数据访问才引入；简单 CRUD 不强制增加。
- DTO：定义和校验外部输入。
- Module：声明依赖与模块边界。
- 禁止 Controller 直接注入或调用 Prisma。
- 禁止将业务规则写入 PrismaService 或 common 基础设施。

## Prisma 强制规则
- 全项目通过统一 `PrismaService` 使用 Prisma Client。
- 禁止业务模块 `new PrismaClient()` 或自行创建数据库连接。
- Prisma Client 初始化、连接、关闭由 `src/database/` 统一管理。
- Schema 是数据模型事实来源；修改前检查关系、索引、唯一约束和迁移历史。
- 数据库变更通过 Prisma Migration 管理；生产环境禁止使用 `prisma migrate dev` 或随意执行 `prisma db push`。
- 复杂多步写操作在必要时使用 `$transaction`，事务范围尽量短。
- 防范 N+1、无边界 include、无分页列表和过度字段读取。
- 金额等精确数值使用 Decimal 或最小货币单位整数，禁止用 Float 做财务计算。
- 库存、余额、积分等并发敏感数据必须考虑数据库约束、原子更新、事务和幂等。
- Prisma 错误统一转换，不得向客户端泄漏 SQL、连接串或堆栈。
- `prisma` 与 `@prisma/client` 版本按项目锁定版本保持兼容。

## DTO / API
- 所有外部输入使用 DTO 校验，不可信任 `req.body/query/params`。
- 使用 ValidationPipe；按项目策略启用 whitelist、forbidNonWhitelisted、transform。
- 分页、排序、筛选字段设置上限和白名单。
- 不直接将 Prisma Model 作为 API 契约；使用 Response DTO 或显式映射。
- 不得返回密码哈希、内部字段或未经授权的关联数据。
- API 响应 envelope、分页、日期格式、错误码全项目统一。

## 安全与错误
- 密钥、Token、数据库 URL 不得写入代码或提交 Git；提供不含真实凭证的 `.env.example`。
- 使用统一 Guard/Strategy 做认证授权；每次资源读写都检查归属和权限。
- 密码必须使用安全哈希，不得明文或可逆加密保存。
- 日志不得记录密码、Token、数据库凭证及敏感个人信息。
- 使用统一异常处理；禁止空 catch、静默吞错和向客户端返回内部堆栈。
- 使用 Nest Logger 或项目日志服务，避免散落 console.log。

## 依赖与架构
- 公共基础设施放在 `common/`、`database/` 或明确的 infrastructure 模块。
- 新增依赖前说明用途、现有依赖是否可满足、维护状态和安全风险。
- 不要机械包装 Nest 装饰器或 TypeScript；只抽象有统一策略、复用或替换价值的能力。
- 禁止无理由创建万能 BaseService、BaseRepository 或通用 CRUD 框架。
- 禁止无关重构、擅自改变公共 API 或破坏性修改数据库。

## 测试与交付
按项目实际脚本尽可能执行 lint、unit test、e2e test、build、Prisma validate/generate。
交付必须说明修改文件、API/Schema 变更、迁移方式、测试结果、新增依赖和风险。不得声称执行了未运行的检查。
