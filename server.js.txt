const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
 
app.use(express.static('public'));
 
app.use('/forms', createProxyMiddleware({
  target: 'https://tools.investwellonline.com',
  changeOrigin: true,
  onProxyRes: (proxyRes) => {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));
 
app.listen(3000, () => console.log('Running!'));