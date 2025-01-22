const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const authorizationHeader = process.env.AUTHORIZATION_HEADER;

// Proxy for Hackage API
app.use(
  '/api/hackage',
  createProxyMiddleware({
    target: 'https://hackage.haskell.org',
    changeOrigin: true,
    pathRewrite: {
      '^/api/hackage': '',
    },
    headers: {
      Authorization: authorizationHeader,
    },
  })
);

// Proxy for Hoogle API
app.use(
  '/api/hoogle',
  createProxyMiddleware({
    target: 'https://hoogle.haskell.org',
    changeOrigin: true,
    pathRewrite: {
      '^/api/hoogle': '',
    },
    headers: {
      Authorization: authorizationHeader
    }
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
