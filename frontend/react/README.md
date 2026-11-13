# React Agent 工程规范包

本规范包用于 Vite + React + TypeScript + Ant Design + Tailwind CSS + Zustand + Axios + React Router v6 项目。

## 文件说明

```text
AGENTS.md                         # Agent 必须遵守的开发规则
README.md                         # 本说明
docs/
  architecture.md                 # 分层架构与目录职责
  development.md                  # 编码、组件、样式和测试规范
  adapters.md                     # 第三方库适配层规范
examples/
  adapters/
    http/                         # Axios 适配示例
    store/                        # Zustand 适配示例
    router/                       # React Router v6 适配示例
    ui/                            # Ant Design 适配示例
eslint.import-restrictions.example.js # ESLint 导入限制示例
```

## 放入现有项目

1. 将 `AGENTS.md` 放到项目根目录。
2. 将 `docs/` 放到项目根目录。
3. 将 `examples/` 作为参考，不要未经检查直接覆盖现有 `src/`。
4. 根据项目当前 ESLint 版本，将导入限制规则合并到现有 ESLint 配置。
5. 对照 `docs/adapters.md`，逐步建立 `src/adapters/` 统一适配层。
6. 让 Agent 先遵循规范开发新功能，再逐步迁移存量代码。

## 推荐目录

```text
src/
├── adapters/
│   ├── http/
│   ├── router/
│   ├── store/
│   └── ui/
├── core/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── components/
├── modules/
├── services/
├── stores/
├── router/
├── styles/
├── App.tsx
└── main.tsx
```

## 重要说明

- 本规范强调“稳定的项目内部 API”，不是把第三方库的所有 API 原样再包装一遍。
- Vite、React、TypeScript、Tailwind CSS 属于基础设施，不要求为了封装而增加无意义的运行时包装层。
- 示例代码是适配层起点。接入前需结合当前项目的 API 响应格式、鉴权方式、路由版本和 UI 规范调整。
- `react-router-dom` v6 的不同小版本 API 有差异。示例采用 v6.4+ Data Router API；若项目使用较早的 v6，请按当前版本调整路由创建方式。
