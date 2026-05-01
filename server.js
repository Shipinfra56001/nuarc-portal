const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

const TARGET = 'https://tools.investwellonline.com';

// Serve our branded index.html ONLY at the root "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy ALL other requests transparently to the target site
app.use('/', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  secure: false,
  on: {
    proxyReq: function (proxyReq) {
      proxyReq.setHeader('Host', 'tools.investwellonline.com');
      proxyReq.setHeader('Referer', TARGET);
      proxyReq.setHeader('Origin', TARGET);
    },
    proxyRes: function (proxyRes) {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['X-Frame-Options'];
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['Content-Security-Policy'];
      delete proxyRes.headers['x-content-type-options'];
      proxyRes.headers['access-control-allow-origin'] = '*';
    },
    error: function (err, req, res) {
      console.error('Proxy error:', err.message);
      res.status(500).send('Proxy error: ' + err.message);
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Nuarc Fintech Portal running on port ' + PORT));
