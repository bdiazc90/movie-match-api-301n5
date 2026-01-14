import express from 'express';
import moviesRouter from './routes/movies.js';
import directorsRouter from './routes/directors.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3001;

app.set('etag', false);
// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a Movie Match API 🎬',
    endpoints: {
      movies: {
        all: 'GET /movies',
        filterByGenre: 'GET /movies?genre=Sci-Fi',
        filterCombined: 'GET /movies?genre=Sci-Fi&minRating=8',
        byId: 'GET /movies/:id',
        random: 'GET /movies/random'
      },
      directors: {
        all: 'GET /directors',
        filterByName: 'GET /directors?name=nolan',
        filterByMinMovies: 'GET /directors?minMovies=2',
        byName: 'GET /directors/:name',
        random: 'GET /directors/random'
      }
    }
  });
});

// Montar routers
app.use('/movies', moviesRouter);
app.use('/directors', directorsRouter);

app.listen(PORT, () => {
  console.log(`🎬 Movie Match API corriendo en http://localhost:${PORT}`);
  console.log(`🎬 Variable de Entorno OPENROUTER_API_KEY: ` + process.env.OPENROUTER_API_KEY);
});