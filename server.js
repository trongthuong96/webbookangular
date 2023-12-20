const express = require('express');
const httpProxy = require('http-proxy');
const fs = require('fs');
const https = require('https');

const app = express();
const apiProxy = httpProxy.createProxyServer();

const apiServer = 'http://api.truyenmoi.click';
//const apiServer = 'https://localhost:7131';

// Bật chế độ không kiểm tra chứng chỉ
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.all('/api/*', (req, res) => {
  apiProxy.web(req, res, { target: apiServer, secure: false });
});

const port = process.env.PORT || 4000;

// Sử dụng HTTPS để tạo server
const server = https.createServer({
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
}, app);

//const server = https.createServer(app);

server.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
