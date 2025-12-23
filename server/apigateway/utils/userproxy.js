const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  logLevel: 'debug'
});
