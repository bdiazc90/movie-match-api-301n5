import prisma from '#lib/prisma.js';

export async function getReviewsByMovie(movieId) {
  return await prisma.review.findMany({
    where: { movieId: parseInt(movieId) },
    orderBy: { createdAt: 'desc' }
  });
}
