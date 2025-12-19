const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  logLevel: 'debug'
});
