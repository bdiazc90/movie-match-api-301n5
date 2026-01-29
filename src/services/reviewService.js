import prisma from '#lib/prisma.js';

export async function getReviewsByMovie(movieId) {
  return await prisma.review.findMany({
    where: { movieId: parseInt(movieId) },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createReview(movieId, data) {
  const parsedMovieId = parseInt(movieId);

  // Verificar que la película existe
  const movie = await prisma.movie.findUnique({
    where: { id: parsedMovieId }
  });

  if (!movie) {
    throw new Error('Película no encontrada');
  }

  // Crear el nuevo review
  const newReview = await prisma.review.create({
    data: {
      movieId: parsedMovieId,
      author: data.author,
      rating: parseInt(data.rating),
      content: data.content
    }
  });

  // Obtener todos los reviews de la película (incluyendo el recién creado)
  const allReviews = await prisma.review.findMany({
    where: { movieId: parsedMovieId }
  });

  // Calcular el promedio
  const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

  // Actualizar el rating de la película
  await prisma.movie.update({
    where: { id: parsedMovieId },
    data: { rating: averageRating }
  });

  return newReview;
}
