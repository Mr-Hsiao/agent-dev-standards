# 测试与质量规范

## 测试分层
- Unit：纯业务规则、Schema 校验和 Service 分支。
- Integration：Router、数据库和 Repository 组合行为。
- Contract：API 响应结构、状态码和错误格式。
- E2E：按项目规模覆盖关键业务链路。

## 测试约定
- 使用 pytest；异步测试使用 pytest-asyncio。
- API 测试使用 httpx AsyncClient / ASGITransport，按项目版本配置。
- 测试数据库与生产数据库隔离。
- 外部服务通过 Adapter mock，不调用真实支付、短信、邮件服务。
- 测试数据显式创建和清理，避免依赖执行顺序。
- Bug 修复必须补充回归测试。

## 质量门禁
```bash
ruff check .
ruff format --check .
pytest
```
若项目启用类型检查，再执行 `mypy app`。统一团队工具后，不要同时引入多个功能重叠的 lint / formatter。
