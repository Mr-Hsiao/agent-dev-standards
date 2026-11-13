# React 开发规范

## 1. TypeScript

- 开启严格类型检查，避免新增 `any`。
- 不确定的数据使用 `unknown`，通过类型守卫收窄。
- 公共函数、组件 Props、服务接口和 Store 必须定义类型。
- 避免重复定义相同业务类型；共享类型放在合适的模块公共位置。
- 类型断言必须有明确理由，不得用断言掩盖类型错误。

## 2. React 组件

- 使用函数组件和 Hooks。
- 组件名使用 PascalCase。
- Hooks 以 `use` 开头。
- 组件只负责 UI 展示、用户交互和必要的视图状态。
- 复杂业务逻辑放入模块 Hooks 或独立业务函数。
- 可复用组件放入 `components/`；仅当前模块使用的组件放入模块内部。
- 避免超大组件；当组件承担多个职责、难以测试或频繁变更时拆分。
- 正确处理 `useEffect` 依赖，禁止通过忽略依赖警告掩盖问题。
- 列表渲染使用稳定且唯一的 key。

## 3. API 与 Services

- API 定义放在 `services/<domain>/`。
- 统一通过 `@/adapters/http` 发起请求。
- Services 负责接口调用和必要的数据转换，不负责 UI 提示或页面跳转。
- 请求和响应必须有明确类型。
- 页面负责展示加载、错误、空数据状态。
- 不得在组件中直接创建 Axios 实例或调用原生 fetch（除非项目规范明确批准特殊场景）。

## 4. Zustand Store

- 按业务域拆分 Store。
- Store 文件采用 `xxx.store.ts`。
- 状态字段使用 camelCase，Action 使用动词开头的 camelCase。
- 组件通过 selector 读取所需字段。
- 不要把临时输入框值、纯展示状态全部塞进全局 Store。
- 持久化必须明确字段范围、存储位置和版本迁移策略。

## 5. 路由

- 路由定义集中在 `src/router/`。
- 页面组件不得自行创建 Router。
- 权限控制统一在路由边界或项目定义的权限组件中实现。
- 页面跳转使用项目路由适配 API。
- 路由路径集中定义常量，避免重复硬编码。

## 6. Ant Design 与 Tailwind

- Ant Design 负责复杂交互组件。
- Tailwind CSS 负责布局、间距、尺寸和普通样式。
- 优先使用项目封装的 UI 组件。
- 主题 Token 集中管理。
- 不要在业务代码中重复定义主题色和设计变量。
- 避免大量 `!important` 和针对第三方组件内部 DOM 的脆弱选择器。

## 7. 命名规范

| 对象 | 规范 | 示例 |
|---|---|---|
| React 组件 | PascalCase | `UserTable` |
| Hook | `use` + PascalCase | `useUserList` |
| 函数/变量 | camelCase | `getUserList` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| 类型/接口 | PascalCase | `UserInfo` |
| Store 文件 | `xxx.store.ts` | `user.store.ts` |
| API 文件 | `xxx.api.ts` | `user.api.ts` |
| 样式文件 | 与模块对应 | `user.css` |

## 8. 错误处理

- 区分网络错误、HTTP 错误、业务错误和前端运行时错误。
- 不允许静默吞错。
- 面向用户的错误提示统一通过项目 UI 反馈适配层。
- 日志不得输出 Token、密码、身份证号等敏感信息。
- 不要在底层适配层写死具体业务页面的错误提示和跳转规则。

## 9. 测试与质量

按项目实际配置执行：
- TypeScript 类型检查；
- ESLint；
- Prettier；
- 单元测试；
- Vite 生产构建。

至少为适配层关键行为编写测试。公共组件应覆盖主要交互和边界状态。

## 10. 提交前自检

- 是否复用了现有组件、Hook、API 和 Store？
- 是否有业务代码直接导入第三方库？
- 是否新增了重复依赖？
- 是否定义了必要类型？
- 是否处理加载、错误和空状态？
- 是否存在无关修改？
- 是否执行并如实记录检查结果？
