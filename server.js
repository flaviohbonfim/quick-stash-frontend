import { createServer } from 'node:http';
import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const PORT = parseInt(process.env.PORT || '3001', 10);
const DIST_DIR = join(import.meta.dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.map': 'application/json',
};

const server = createServer((req, res) => {
  let pathname = req.url.split('?')[0].split('#')[0];

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = join(DIST_DIR, pathname);

  if (!existsSync(filePath) || !filePath.startsWith(DIST_DIR)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(readFileSync(join(DIST_DIR, 'index.html'), 'utf-8'));
    return;
  }

  const ext = join(pathname, '').split('.').pop();
  const contentType = mimeTypes['.' + ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
  res.end(readFileSync(filePath));
});

server.listen(PORT, () => {
  console.log(`Quick Stash serving on port ${PORT}`);
});
