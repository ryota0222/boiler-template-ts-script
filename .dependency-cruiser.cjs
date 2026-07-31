/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'zod-only-in-entities-and-gateways',
      comment: 'zodはentitiesとgatewaysディレクトリ内でのみ使用可能',
      severity: 'error',
      from: {
        path: '^src/',
        pathNot: '^src/(entities|gateways)/',
      },
      to: {
        path: 'zod',
      },
    },
    {
      name: 'no-external-internal-access',
      comment: 'internal/は同階層のファイルからのみアクセス可能',
      severity: 'error',
      from: {
        path: '^src/(.+)/[^/]+$',
        pathNot: '/internal/',
      },
      to: {
        path: '^src/(.+)/internal/',
        pathNot: '^src/$1/internal/',
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
