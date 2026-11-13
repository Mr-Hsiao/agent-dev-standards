# NestJS 开发规范

## TypeScript 与命名
- 使用 TypeScript strict；禁止新增 any，不确定数据使用 unknown 并收窄。
- 类、DTO、类型使用 PascalCase；变量和方法使用 camelCase；常量使用 UPPER_SNAKE_CASE。
- 文件名遵循 Nest CLI 现有 kebab-case 约定，如 `users.controller.ts`、`create-user.dto.ts`。

## Controller
- 只负责路由、参数绑定、状态码和调用 Service。
- 不写数据库查询、复杂业务规则；不直接注入 PrismaService。
- 所有外部输入使用 DTO；认证授权使用统一 Guard/Decorator。

## Service
- 按业务用例组织方法，负责业务规则、流程编排和事务边界。
- 不依赖 Express Request/Response，除非确有基础设施需要。
- 不把多个业务域逻辑堆入一个 Service。
- 外部调用设置超时和错误处理；写操作重试必须考虑幂等。

## DTO 与验证
- 使用 class-validator / class-transformer（如项目采用）。
- 全局配置 ValidationPipe，推荐评估启用 `whitelist`、`forbidNonWhitelisted`、`transform`。
- 嵌套对象使用嵌套校验；分页、排序、筛选设置上限和白名单。
- 不把 Prisma CreateInput/UpdateInput 直接当 HTTP DTO。
- 明确区分 PATCH 字段未提供与显式 null。

## Module 与依赖注入
- 使用 Nest DI 管理 Provider。
- Provider 默认 singleton；仅有明确需求时使用 Request/Transient Scope。
- Module 只导出其他模块需要的 Provider。
- 避免循环依赖，forwardRef 不作为默认方案。

## API 与异常
- GET 查询、POST 创建/动作、PATCH 局部更新、DELETE 删除。
- 全项目统一响应 envelope、分页结构、日期格式、错误码和 requestId。
- 使用统一 Exception Filter；区分参数、业务、认证、授权、资源不存在和系统错误。
- 不允许空 catch 或静默吞错；生产环境不返回内部堆栈。

## 测试
- Service 单测覆盖业务规则和异常分支。
- E2E 覆盖鉴权、权限和核心业务流程。
- Prisma 测试使用隔离测试数据库，绝不连接生产库。
- Seed/test data 应可重复执行和清理。
- 修改后按项目脚本运行 lint、test、test:e2e、build。
