import { movies } from '#data/movies.js';
import prisma from '#lib/prisma.js';
import { getMovies, createMovie as createMovieService } from '#services/moviesService.js';

const sendSuccess = (res, data) => {
  const arr = Array.isArray(data) ? data : [data]; // Siempre retornará un arreglo.
  res.json({ success: true, data: arr, count: arr.length });
};

const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

export function getRandomMovie() {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
}

export async function getAllMovies(req, res) {
    const movies = await getMovies();
    if (movies.length < 1) return sendError(res, 401, "No hay películas");
    return sendSuccess(res, movies);
}

export async function createMovie(req, res) {
    const { title, year, rating, poster, genre } = req.body;

    // Validación de campos requeridos
    if (!title || year === undefined || rating === undefined) {
        return sendError(res, 400, 'Campos requeridos: title, year, rating');
    }

    // Validación de tipos
    if (typeof title !== 'string' || title.trim() === '') {
        return sendError(res, 400, 'title debe ser un string no vacío');
    }

    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 5) {
        return sendError(res, 400, 'year debe ser un número entero válido (1888 - actualidad)');
    }

    if (typeof rating !== 'number' || rating < 0 || rating > 10) {
        return sendError(res, 400, 'rating debe ser un número entre 0 y 10');
    }

    // Validar genero existente y match con algun enum Genre:
    const validGenres = Object.keys(prisma.$enums.Genre);
    if (!genre || typeof genre !== 'string' || !validGenres.includes(genre.toUpperCase())) {
        return sendError(res, 400, `genre es requerido y debe ser uno de los siguientes: ${validGenres.join(', ')}`);
    }

    if (poster !== undefined && typeof poster !== 'string') {
        return sendError(res, 400, 'poster debe ser un string (URL)');
    }

    try {
        const movie = await createMovieService({
            title: title.trim(),
            year,
            rating,
            genre,
            poster: poster?.trim() || null
        });
        res.status(201);
        return sendSuccess(res, movie);
    } catch (error) {
        return sendError(res, 500, 'Error al crear la película: ' + error.message);
    }
}
