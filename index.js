import {App} from './liteExpress.js';

const app = new App();


app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Welcome to our custom Express-like framework!');
});

app.get('/hi-world', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello, World!' }));
});

app.post('/data', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ receivedData: req.body }));
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});