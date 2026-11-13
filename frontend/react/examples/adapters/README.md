# 适配层示例

本目录是参考实现，不是可直接覆盖现有项目的完整框架。

## 接入前必须调整

1. `http/instance.ts`：接入真实 Token 读取方式。
2. `http/http.ts`：根据后端真实响应结构决定是否需要统一响应解包、错误转换和取消请求能力。
3. `router/`：确认项目安装的 React Router v6 小版本。示例使用 v6.4+ Data Router。
4. `ui/`：按项目设计规范扩展 Button、Table、Modal、Form 等组件。
5. 为适配层补充测试，并从业务目录逐步迁移直接导入。

## 注意

- 示例中的 Axios `http.ts` 直接返回 `response.data`，仅适用于接口响应协议允许这种处理的项目。
- `client.ts` 通过函数注入 Token，避免 HTTP 适配层与业务 Store 形成循环依赖。
- Zustand 示例只封装 Store 创建入口；不要在适配层集中存放业务状态。
- 不要为了统一入口而把所有底层类型和所有 API 全部透传给业务层。
