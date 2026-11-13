const packagesByDirectory = {
  'src/adapters/ui/**': 'antd',
  'src/adapters/http/**': 'axios',
  'src/adapters/store/**': 'zustand',
  'src/adapters/router/**': 'react-router-dom',
  'src/router/**': 'react-router-dom',
};

const packages = [...new Set(Object.values(packagesByDirectory))];

function restrictions(allowedPackage) {
  const blocked = packages.filter((name) => name !== allowedPackage);
  return {
    'no-restricted-imports': [
      'error',
      {
        paths: blocked,
        patterns: [
          {
            group: blocked.map((name) => name + '/**'),
            message: '请通过项目对应的适配层访问此依赖。',
          },
        ],
      },
    ],
  };
}

// 在 ESLint flat config 中展开此数组。沿用项目现有的 TS/TSX parser。
export const adapterImportRestrictions = [
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: restrictions(),
  },
  ...Object.entries(packagesByDirectory).map(([directory, allowedPackage]) => ({
    files: [[directory, 'src/**/*.{ts,tsx}']],
    rules: restrictions(allowedPackage),
  })),
];
