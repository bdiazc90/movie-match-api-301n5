import express from 'express';
import * as movieController from '#controllers/movieController.js';
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


// GET /movies (con filtros)
router.get('/', movieController.getAllMovies);

// POST /movies
router.post('/', movieController.createMovie);

// GET /movies/random
router.get('/random', (req, res) => {
  const randomMovie = movieController.getRandomMovie();
  sendSuccess(res, randomMovie);
});


router.get('/search', movieController.search);

// GET /movies/discover
router.get('/discover', async (req, res) => {
  const randomMovie = movieController.getRandomMovie();
  // enviar al servicio de OPENROUTER para enriquecer con anécdotas:
  const enrichedMovie = await enrichMovie(randomMovie);

  sendSuccess(res, enrichedMovie);
});

// GET /movies/:id
router.get('/:id', movieController.getById);

export default router;