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

export async function searchMovies(params) {
  const { q, genre, yearMin, yearMax, ratingMin, page = 1, limit = 10 } = params;

  // Construir filtros
  const where = {
    AND: []
  };

  // Búsqueda por título
  if (q) {
    where.AND.push({
      title: { contains: q, mode: 'insensitive' }
    });
  }

  // Filtro por género
  if (genre) {
    where.AND.push({ genre });
  }

  // Rango de años
  if (yearMin || yearMax) {
    const yearFilter = {};
    if (yearMin) yearFilter.gte = parseInt(yearMin);
    if (yearMax) yearFilter.lte = parseInt(yearMax);
    where.AND.push({ year: yearFilter });
  }

  // Rating mínimo
  if (ratingMin) {
    where.AND.push({
      rating: { gte: parseFloat(ratingMin) }
    });
  }

  // Si no hay filtros, eliminar AND vacío
  if (where.AND.length === 0) {
    delete where.AND;
  }

  // Ejecutar consulta con paginación
  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      include: {
        _count: { select: { reviews: true } }
      },
      orderBy: { rating: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    }),
    prisma.movie.count({ where })
  ]);

  return {
    data: movies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  };
}