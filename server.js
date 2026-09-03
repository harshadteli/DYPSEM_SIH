const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Case-insensitive file lookup for Linux hosting
function findFileCaseInsensitive(baseDir, relativePath) {
  const parts = relativePath.split(/[/\\]/).filter(Boolean);
  let currentPath = baseDir;

  for (const part of parts) {
    if (!fs.existsSync(currentPath)) return null;
    try {
      const items = fs.readdirSync(currentPath);
      const matched = items.find(item => item.toLowerCase() === part.toLowerCase());
      if (!matched) return null;
      currentPath = path.join(currentPath, matched);
    } catch (e) {
      return null;
    }
  }
  return currentPath;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const relativePath = pathname.replace(/^\/+/, '');
  const filePath = findFileCaseInsensitive(PUBLIC_DIR, relativePath);

  if (!filePath || !fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>404 Not Found</h1><p>The requested file could not be found on the server.</p>');
    return;
  }

  // Check if directory
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      serveFile(indexPath, res);
    } else {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Directory listing forbidden');
    }
    return;
  }

  serveFile(filePath, res);
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*'
  };

  // Cache headers for static assets
  if (ext === '.html') {
    headers['Cache-Control'] = 'no-cache';
  } else {
    headers['Cache-Control'] = 'public, max-age=604800'; // 1 week
  }

  res.writeHead(200, headers);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', err => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Server Error');
  });
}

server.listen(PORT, () => {
  console.log(`DYPSEM SIH Server running on http://localhost:${PORT}`);
});
