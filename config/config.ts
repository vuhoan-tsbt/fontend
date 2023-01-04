import { defineConfig } from 'umi';
import defineEnv from './defineEnv';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/assets/favicon.ico',
  routes,
  hash: true,
  locale: {
    default: 'vi-VN',
    // useLocalStorage: true,
    baseNavigator: true,
    title: true,
    baseSeparator: '-',
  },
  fastRefresh: {},
  define: defineEnv(),
  theme: {
    '@border-radius-base': '4px',
  },
});
