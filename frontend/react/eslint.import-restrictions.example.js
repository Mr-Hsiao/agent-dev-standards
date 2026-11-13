/*
 * 将以下规则合并到项目现有 ESLint 配置中。
 * 此文件是配置示例，不应在未检查现有 ESLint 版本和配置格式时直接覆盖 eslint.config.js。
 *
 * 适用于 ESLint flat config 的规则片段。
 * 若项目使用旧版 .eslintrc，请转换为对应 overrides 配置。
 */

export const adapterImportRestrictions = {
  files: ['src/**/*.{ts,tsx}'],
  ignores: [
    'src/adapters/**',
    'src/router/**', // 路由配置层允许使用 react-router-dom
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'antd',
            message: '业务代码请从 @/adapters/ui 导入项目 UI 组件。',
          },
          {
            name: 'axios',
            message: '业务代码请从 @/adapters/http 调用统一 HTTP API。',
          },
          {
            name: 'zustand',
            message: '业务 Store 请通过 @/adapters/store 创建。',
          },
          {
            name: 'react-router-dom',
            message: '业务组件请从 @/adapters/router 使用项目路由 API。',
          },
        ],
        patterns: [
          {
            group: [
              'antd/*',
              'axios/*',
              'zustand/*',
              'react-router-dom/*',
            ],
            message: '禁止在业务代码中深层导入第三方库，请使用项目适配层。',
          },
        ],
      },
    ],
  },
};

/*
 * Flat config 中的合并示意：
 *
 * import { adapterImportRestrictions } from './eslint.import-restrictions.example.js';
 * export default [
 *   ...existingConfigs,
 *   adapterImportRestrictions,
 * ];
 *
 * 注意：如果现有配置对 ignores、files 或插件有特殊设置，应合并规则而不是直接替换。
 */
