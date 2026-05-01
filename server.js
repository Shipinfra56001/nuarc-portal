const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const proxyOptions = {
  target: 'https://tools.investwellonline.com',
  changeOrigin: true,
  secure: false,
  selfHandleResponse: false,
  on: {
    proxyRes: function (proxyRes) {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['X-Frame-Options'];
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['Content-Security-Policy'];
      proxyRes.headers['access-control-allow-origin'] = '*';
    },
    error: function (err, req, res) {
      res.status(500).send('Proxy error: ' + err.message);
    }
  }
};

app.use('/forms', createProxyMiddleware(proxyOptions));
app.use('/assets', createProxyMiddleware(proxyOptions));
app.use('/static', createProxyMiddleware(proxyOptions));
app.use('/api', createProxyMiddleware(proxyOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Nuarc Fintech Portal running on port ' + PORT));
