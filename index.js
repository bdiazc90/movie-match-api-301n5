// ===== Importaciones siempre arriba
import express from 'express';
import moviesRouter from './routes/movies.js';
import directorsRouter from './routes/directors.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { logger } from './middlewares/logger.js';

// ===== Configuracion inicial
dotenv.config();

// ===== Iniciar aplicacion
const app = express();
const PORT = 3001;

// ===== Cargar los MIDDLEWARES GLOBALES (ANTES de rutas) =====
app.use(cors());           // Permite requests de otros dominios
app.use(express.json());   // Parsea JSON en body de requests
app.use(logger);      // Tu middleware de logging

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