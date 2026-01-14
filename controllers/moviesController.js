import { movies } from '../data/movies.js'; // Acceder a los datos

export function getRandomMovie() {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
}
