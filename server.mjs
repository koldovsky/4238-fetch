import { createServer } from 'http';
import { readFile, stat, appendFile } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname, join, resolve } from 'path';

const PORT = 3000;
const ROOT = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

function getMimeType(filePath) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
}


const CHAT_FILE = resolve(ROOT, 'chat.txt');

const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Chat endpoint
  if (urlPath === '/chat') {
    if (req.method === 'GET') {
      // Read chat history
      try {
        const data = await readFile(CHAT_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      } catch (err) {
        // If file does not exist, return empty
        if (err.code === 'ENOENT') {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      }
      return;
    } else if (req.method === 'POST') {
      // Write chat message
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        // Limit body size to 10KB
        if (body.length > 10 * 1024) req.destroy();
      });
      req.on('end', async () => {
        // Save message as a line in chat.txt
        // Accept plain text or JSON { message: "..." }
        let message = '';
        try {
          if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
            const parsed = JSON.parse(body);
            message = typeof parsed.message === 'string' ? parsed.message : '';
          } else {
            message = body;
          }
        } catch {
          message = body;
        }
        message = message.replace(/\r?\n/g, ' ').trim();
        if (message) {
          await appendFile(CHAT_FILE, message + '\n', 'utf8');
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      });
      req.on('error', () => {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      });
      return;
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }
  }

  // Static file serving
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = resolve(ROOT, '.' + urlPath);

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }
    res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
    createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}/`);
});
