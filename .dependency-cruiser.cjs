/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'zod-only-in-entities',
      comment: 'zodはentitiesディレクトリ内でのみ使用可能',
      severity: 'error',
      from: {
        path: '^src/',
        pathNot: '^src/entities/',
      },
      to: {
        path: 'zod',
      },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
