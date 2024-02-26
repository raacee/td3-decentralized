const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World !');
});

app.get('/getServer', (req, res) => {
  const serverUrl = `localhost:${port}`;
  res.json({ code: 200, server: serverUrl });
});

app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});
