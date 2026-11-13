# 架构规范

## 分层职责

| 层 | 职责 | 不应承担 |
|---|---|---|
| API Router | HTTP 路由、参数绑定、依赖注入、响应状态 | 业务规则、直接 SQL |
| Schema | 请求/响应 DTO、数据校验 | 数据库操作 |
| Service | 用例编排、业务规则、事务边界 | HTTP Request/Response 细节 |
| Repository | 数据读写与查询封装 | HTTP 状态码、流程编排 |
| Domain | 核心实体、值对象、领域规则 | FastAPI / ORM 依赖 |
| Infrastructure / Adapter | 数据库、缓存、外部 SDK、文件等实现 | 业务决策 |

依赖方向：API -> Service -> Domain / Repository 接口；Infrastructure 实现 Repository 或 Adapter。

## 模块边界
- 每个业务模块拥有自己的 router、schema、service、repository（按复杂度决定是否需要）。
- 模块间通过 Service 接口或明确的应用层方法协作，避免跨模块直接操作对方表。
- 通用能力放在 `core/` 或 `infrastructure/`，不要把业务规则放进 `utils.py`。
- `main.py` 只负责应用创建、路由注册、中间件和生命周期挂载。
- 小型项目可以合并过细目录，但不得把所有代码堆在 `main.py`。
