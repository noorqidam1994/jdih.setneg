const webpack = require('webpack');
const headers = require('./lib/headers');
require('dotenv').config();
const isProd = process.env.NODE_ENV === 'production';

    module.exports = {
      reactStrictMode: true,
      assetPrefix: (isProd && process.env.NEXT_APP_DOMAIN) ? process.env.NEXT_APP_DOMAIN : '',
      pageExtensions: ['js'],
      typescript: {
        ignoreBuildErrors: true,
      },
      distDir: 'build',
      eslint: {
        ignoreDuringBuilds: true,
      },
      async headers() {
        return [
          {
            source: '/(.*)',
            headers,
          },
        ];
      },
      webpack: config => {
        const env = Object.keys(process.env).reduce((acc, curr) => {
          acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
          return acc;
        }, {});
        config.plugins.push(new webpack.DefinePlugin(env));
        config.externals = config.externals.concat(['sqlite3', 'mariasql', 'mysql', 'oracle', 'strong-oracle', 'oracledb', 'pg', 'pg-query-stream', 'tedious']);
        return config;
      },
    };