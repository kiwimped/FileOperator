// Import required modules
const fs = require('fs');
const path = require('path');
const http = require('http');

// Step 4: Read a File using Filesystem and Path Modules
const filePath = path.join(__dirname, 'example.txt');
let fileData = '';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  fileData = data;
  console.log('File read successfully:', data);
});

// Step 5: Create an HTTP Server and REST API using HTTP Module
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.end(`HTTP Server says: ${fileData}`);
  } else if (req.url === '/api/users') {
    const users = JSON.stringify([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(users);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('HTTP Server and REST API running on port 3001');
});