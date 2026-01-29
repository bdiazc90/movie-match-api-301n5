import prisma from "#lib/prisma.js";

export async function getMovies() {
    return await prisma.movie.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function getMovieById(id) {
    return await prisma.movie.findUnique({
        where: { id: parseInt(id) },
        include: { reviews: true }
    });
}

export async function createMovie(data) {
    return await prisma.movie.create({
        data: {
            title: data.title,
            year: data.year,
            rating: data.rating,
            genre: data.genre,
            poster: data.poster || null
        }
    });
}