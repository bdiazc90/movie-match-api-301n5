import express from 'express';
import { movies } from '#data/movies.js';
import * as moviesController from '#controllers/moviesController.js';
import { enrichMovie } from '#services/openrouter.js';

const router = express.Router();

// Helpers para respuestas consistentes
const sendSuccess = (res, data) => {
  const arr = Array.isArray(data) ? data : [data]; // Siempre retornará un arreglo.
  res.json({ success: true, data: arr, count: arr.length });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

router.get('/prisma', moviesController.getAllMovies);
router.post('/prisma', moviesController.createMovie);


// GET /movies (con filtros)
router.get('/', (req, res) => {
  let result = movies;

  if (req.query.genre) {
    const genre = req.query.genre.toLowerCase();
    result = result.filter(m => m.genre.toLowerCase() === genre);
  }

  if (req.query.minRating) {
    const minRating = parseFloat(req.query.minRating);
    result = result.filter(m => m.rating >= minRating);
  }

  if (req.query.year) {
    const year = parseInt(req.query.year);
    result = result.filter(m => m.year === year);
  }

  if (req.query.director) {
    const director = req.query.director.toLowerCase();
    result = result.filter(m => m.director.toLowerCase().includes(director));
  }

  sendSuccess(res, result);
});

// POST /movies
router.post('/', (req, res) => {
  const { title, year, genre, director, rating } = req.body;

  // Validación de campos requeridos
  if (!title || !year || !genre || !director || rating === undefined) {
    return sendError(res, 400, 'Campos requeridos: title, year, genre, director, rating');
  }

  // Validación de tipos
  if (typeof title !== 'string' || typeof genre !== 'string' || typeof director !== 'string') {
    return sendError(res, 400, 'title, genre y director deben ser strings');
  }

  if (typeof year !== 'number' || typeof rating !== 'number') {
    return sendError(res, 400, 'year y rating deben ser números');
  }

  // Generar nuevo ID
  const newId = Math.max(...movies.map(m => m.id)) + 1;

  // Crear nueva película
  const newMovie = { id: newId, title, year, genre, director, rating };

  // Agregar al array
  movies.push(newMovie);

  // Responder con 201 Created
  res.status(201);
  sendSuccess(res, newMovie);
})

// GET /movies/random
router.get('/random', (req, res) => {
  const randomMovie = moviesController.getRandomMovie();
  sendSuccess(res, randomMovie);
});



// GET /movies/discover
router.get('/discover', async (req, res) => {
  const randomMovie = moviesController.getRandomMovie();
  // enviar al servicio de OPENROUTER para enriquecer con anécdotas:
  const enrichedMovie = await enrichMovie(randomMovie);

  sendSuccess(res, enrichedMovie);
});

// GET /movies/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return sendError(res, 404, `Película no encontrada (id: ${id})`)
  }
  sendSuccess(res, movie);
});

export default router;