const config = {
  plugins: [
    "@tailwindcss/postcss",
    process.env.NODE_ENV === 'production' && [
      'cssnano',
      {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifySelectors: true,
        }]
      }
    ]
  ].filter(Boolean),
};

export default config;
