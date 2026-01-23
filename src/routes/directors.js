import { Router } from 'express';
import { movies } from '#data/movies.js';

const router = Router();

// Función auxiliar para agrupar películas por director
const getDirectorsWithMovies = () => {
  const directorsMap = {};

  movies.forEach(movie => {
    if (!directorsMap[movie.director]) {
      directorsMap[movie.director] = {
        name: movie.director,
        movies: []
      };
    }
    directorsMap[movie.director].movies.push(movie);
  });

  return Object.values(directorsMap);
};

// GET /directors (con filtros)
router.get('/', (req, res) => {
  let result = getDirectorsWithMovies();

  if (req.query.name) {
    const name = req.query.name.toLowerCase();
    result = result.filter(d => d.name.toLowerCase().includes(name));
  }

  if (req.query.minMovies) {
    const minMovies = parseInt(req.query.minMovies);
    result = result.filter(d => d.movies.length >= minMovies);
  }

  res.json(result);
});

// GET /directors/random
router.get('/random', (req, res) => {
  const directors = getDirectorsWithMovies();
  const randomIndex = Math.floor(Math.random() * directors.length);
  res.json(directors[randomIndex]);
});

// GET /directors/:name
router.get('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const directors = getDirectorsWithMovies();
  const director = directors.find(d => d.name.toLowerCase() === name);

  if (!director) {
    return res.status(404).json({ error: 'Director no encontrado', name: req.params.name });
  }

  res.json(director);
});

export default router;
