const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const images = [];

app.post('/upload', (req, res) => {
  const { name, imageUrl, description } = req.body;
  const newImage = { name, imageUrl, description };
  images.push(newImage);
  res.status(201).json({ message: 'Image uploaded successfully' });
});

app.get('/images', (req, res) => {
  res.status(200).json(images);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
