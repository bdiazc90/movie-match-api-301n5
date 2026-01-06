import express from 'express';
import { movies } from './data/movies.js';

const app = express();
const PORT = 3000;

app.set('etag', false);

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a Movie Match API 🎬 - Bruno Diaz Cabanillas' });
});


// Ruta de un servidor HTTP
app.get('/causarellena', (req, res) => {
    const papa = 'papa'
    const aji = 'aji'
    const cebolla = 'cebolla'
    res.send(papa + '-' + aji + '-' + cebolla);
})

// NUEVO: Endpoint para listar películas
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({
      error: 'Película no encontrada',
      id: id
    });
  }

  res.json(movie);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
