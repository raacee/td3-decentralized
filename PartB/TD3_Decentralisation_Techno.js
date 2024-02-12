const express = require('express');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World !');
});

app.get('/getServer', (req, res) => {
  const serverUrl = `localhost:${port}`;
  res.json({ code: 200, server: serverUrl });
});

app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});