# 项目架构规范

## 1. 架构目标

建立业务层与第三方技术库之间的隔离边界。业务代码调用项目内部 API；第三方库只在适配层内部使用。

```text
业务页面 / 业务组件
        |
        v
项目内部 API（components / hooks / services / stores）
        |
        v
adapters（技术适配层）
        |
        v
第三方库（Ant Design / Axios / Zustand / React Router）
```

目标是降低升级和替换成本，而不是承诺任何第三方库都能无成本替换。适配层必须覆盖业务实际使用的能力，且避免泄漏底层类型。

## 2. 目录职责

| 目录 | 职责 | 不应承担 |
|---|---|---|
| `adapters/` | 第三方库适配、统一技术 API | 具体业务规则 |
| `core/` | 全局配置、常量、公共类型、通用工具 | 页面业务逻辑 |
| `components/` | 跨业务复用的 UI 组件 | 单一页面专属逻辑 |
| `modules/` | 业务页面、模块组件、模块 Hooks | 底层 HTTP 客户端创建 |
| `services/` | 业务 API 和数据转换 | 页面 UI 状态 |
| `stores/` | 业务状态及 Action | 直接操作 DOM |
| `router/` | 业务路由表、权限配置 | 业务数据请求实现 |
| `styles/` | 全局样式、主题 Token | 页面级临时样式 |

## 3. 推荐模块结构

```text
modules/
└── user/
    ├── pages/
    │   └── UserPage.tsx
    ├── components/
    │   ├── UserTable.tsx
    │   └── UserForm.tsx
    ├── hooks/
    │   └── useUser.ts
    ├── types/
    │   └── user.types.ts
    └── index.ts

services/
└── user/
    └── user.api.ts

stores/
└── user.store.ts
```

小型业务不必为了目录完整而创建大量空目录。按实际复杂度逐步拆分。

## 4. 依赖方向

允许：

- `modules` 调用 `services`、`stores`、`components` 和 `adapters` 的公开 API。
- `services` 调用 `adapters/http`。
- `stores` 调用 `adapters/store`。
- `router` 使用 `adapters/router`。
- `adapters` 内部依赖对应第三方库。

禁止：

- `adapters` 依赖 `modules`、`services` 或具体业务 Store。
- 业务代码直接导入 Axios、Zustand、Ant Design 或 React Router（路由配置层例外）。
- 业务模块相互深层引用内部文件；跨模块优先通过模块 `index.ts` 暴露的公共 API。

## 5. 统一导出

每个适配层提供 `index.ts`。业务层只从统一入口导入，不使用第三方库深层路径，也不绕过封装。

```ts
import { http } from '@/adapters/http';
import { AppButton, AppTable } from '@/adapters/ui';
import { createAppStore } from '@/adapters/store';
```

## 6. 迁移存量项目

1. 先建立适配层和稳定 API。
2. 选一个新业务模块验证完整流程。
3. 将高频、易变的第三方能力优先迁移。
4. 使用 ESLint 阻止新增违规导入。
5. 按业务迭代逐步迁移旧代码，不做无关的大规模重构。
