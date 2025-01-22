const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const authorizationHeader = process.env.AUTHORIZATION_HEADER;

// Enable access logs
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const log = `${req.ip} - - [${new Date().toISOString()}] \"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}\" ${res.statusCode} ${res.get('Content-Length') || 0} - ${duration}ms`;
    console.log(log);
  });
  next();
});

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
