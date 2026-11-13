import { createHttpClient } from './client';

// 将 getAccessToken 替换为项目实际的认证信息读取方式。
// 不要让 HTTP 适配层直接依赖某个页面组件。
export const httpClient = createHttpClient({
  getAccessToken: () => undefined,
});
