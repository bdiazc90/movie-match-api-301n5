# 🎬 Movie Match Frontend - Prompt para v0.app

## 📋 Descripción General

Crea una aplicación web moderna en **Next.js con App Router** que consuma la API REST de Movie Match. La app debe tener un diseño **colorful & playful** con una paleta vibrante, enfocándose en la exploración detallada de películas, reviews interactivas y descubrimiento con IA.

---

## 🎨 Estilo Visual y Diseño

### Tema: Colorful & Playful
- **Paleta vibrante** con colores distintivos por género de película
- **Gradientes sutiles** en backgrounds y cards
- **Iconografía divertida** con emojis temáticos
- **Animaciones suaves** en hover, transiciones y micro-interacciones
- **Sombras coloridas** en badges y elementos destacados
- **Tipografía moderna** y clara (Inter, Poppins o similar)

### Colores por Género
```
ACTION:    Rojo (#EF4444, #DC2626) 🎬
COMEDY:    Amarillo (#FBBF24, #F59E0B) 😂
DRAMA:     Púrpura (#A855F7, #9333EA) 🎭
HORROR:    Gris oscuro (#1F2937, #111827) 👻
SCIFI:     Azul (#3B82F6, #2563EB) 🚀
THRILLER:  Naranja (#F97316, #EA580C) 💀
```

### Componentes Base
- Usa **shadcn/ui** como base y customiza con colores vibrantes
- **Tailwind CSS** para styling
- **Lucide React** para iconos
- **Embla Carousel** o **Swiper** para carruseles

---

## 🏗️ Arquitectura y Stack Técnico

### Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (customizado)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: SWR o TanStack Query
- **Icons**: Lucide React
- **Carousel**: Embla Carousel / Swiper

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL="https://tu-dominio.onrender.com"
```

---

## 🔌 API Backend - Endpoints Disponibles

### Base URL
```
https://tu-dominio.onrender.com
```

### Formato de Respuesta Estándar
**Importante**: El backend SIEMPRE retorna `data` como un **array**, incluso para un solo objeto.

```typescript
{
  "success": true,
  "data": [/* array de objetos */],
  "count": number
}

// Error
{
  "success": false,
  "error": "mensaje de error"
}
```

### Endpoints

#### 1. GET /movies
Obtiene todas las películas de la base de datos.

**Query params opcionales**:
- `genre` (string): Filtrar por género (ACTION, COMEDY, DRAMA, HORROR, SCIFI, THRILLER)
- `minRating` (number): Rating mínimo (0-10)

**Ejemplo**:
```
GET /movies?genre=ACTION&minRating=7.5
```

**Respuesta**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Inception",
      "year": 2010,
      "genre": "SCIFI",
      "rating": 8.8,
      "poster": "https://example.com/poster.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 2. POST /movies
Crea una nueva película.

**Body** (JSON):
```json
{
  "title": "Parasite",
  "year": 2019,
  "genre": "THRILLER",
  "rating": 8.6,
  "poster": "https://example.com/poster.jpg" // opcional
}
```

**Validaciones**:
- `title`: string, requerido
- `year`: int, 1888 ≤ year ≤ (año actual + 5), requerido
- `genre`: enum (ACTION, COMEDY, DRAMA, HORROR, SCIFI, THRILLER), requerido
- `rating`: float, 0 ≤ rating ≤ 10, requerido
- `poster`: string URL, opcional

**Respuesta 201**:
```json
{
  "success": true,
  "data": [{ ...movie }],
  "count": 1
}
```

---

#### 3. GET /movies/:id
Obtiene detalle de una película **incluyendo todas sus reviews**.

**Respuesta 200**:
```json
{
  "success": true,
  "data": [{
    "id": 1,
    "title": "Inception",
    "year": 2010,
    "genre": "SCIFI",
    "rating": 8.8,
    "poster": "...",
    "createdAt": "...",
    "updatedAt": "...",
    "reviews": [
      {
        "id": 1,
        "movieId": 1,
        "author": "John Doe",
        "content": "Mind-blowing film!",
        "rating": 9,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }],
  "count": 1
}
```

**Error 404**: "Película no encontrada (id: X)"

---

#### 4. GET /movies/discover
Obtiene una película aleatoria **enriquecida con 3 anécdotas generadas por IA**.

**Respuesta 200**:
```json
{
  "success": true,
  "data": [{
    "movie": {
      "id": 1,
      "title": "The Matrix",
      "year": 1999,
      "genre": "SCIFI",
      "rating": 8.7,
      "poster": "..."
    },
    "anecdotes": [
      "Durante el rodaje, Keanu Reeves regaló motos Harley-Davidson al equipo de dobles.",
      "El código verde que cae es en realidad recetas de sushi invertidas.",
      "Carrie-Anne Moss se lesionó un tobillo el primer día de entrenamiento."
    ]
  }],
  "count": 1
}
```

**Error 500**: Error al generar contenido con IA

---

#### 5. POST /movies/:movieId/reviews
Crea una nueva review para una película.

**Body** (JSON):
```json
{
  "author": "Jane Smith",
  "content": "Una obra maestra del cine moderno.",
  "rating": 10
}
```

**Validaciones**:
- `author`: string, requerido (no se permiten reviews anónimas)
- `content`: string, requerido
- `rating`: int, requerido

**Funcionalidad especial**:
⚠️ **Importante**: Al crear una review, el backend **automáticamente recalcula y actualiza** el `rating` promedio de la película. No es necesario hacer un update manual.

**Respuesta 201**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "movieId": 1,
    "author": "Jane Smith",
    "content": "Una obra maestra del cine moderno.",
    "rating": 10,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error 404**: "Película no encontrada"

---

#### 6. GET /movies/:movieId/reviews
Obtiene todas las reviews de una película (ordenadas por fecha desc).

**Respuesta 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "movieId": 1,
      "author": "John Doe",
      "content": "...",
      "rating": 9,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 📱 Estructura de Páginas y Componentes

### Páginas Principales

#### 1. `/` - Landing Page
**Descripción**: Página principal minimalista con **buscador prominente** como elemento hero.

**Elementos**:
- **SearchBar grande y atractivo** (input de búsqueda con icono lupa)
- Búsqueda en tiempo real que filtra películas por título
- Resultados mostrados como grid de `MovieCard` debajo del buscador
- Sección destacada: "Discover with AI" con CTA para `/discover`
- **FAB (+)** flotante bottom-right para agregar película

**Comportamiento**:
- Al escribir en el buscador, fetch a `GET /movies` y filtrar por título client-side
- Autocompletado con resultados en tiempo real
- Click en película → navega a `/movies/[id]`

---

#### 2. `/movies` - Catálogo Completo
**Descripción**: Grid de todas las películas con **filtros laterales/superiores**.

**Elementos**:
- **GenreFilter**: Pills clicables con colores de género (multiselect o single)
- **RatingFilter**: Slider para rating mínimo (0-10)
- Grid responsive de `MovieCard` (4-5 columnas desktop, 2-3 tablet, 1-2 mobile)
- Botón "Clear Filters"
- **FAB (+)** flotante

**Comportamiento**:
- Fetch inicial: `GET /movies`
- Al seleccionar filtros: `GET /movies?genre=ACTION&minRating=7`
- Grid se actualiza automáticamente (SWR revalidate)

**MovieCard** (componente):
```tsx
<div className="relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition">
  <img src={poster} className="w-full h-64 object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
    <Badge className={genreColor}>{genre} {genreEmoji}</Badge>
    <h3 className="text-white font-bold">{title}</h3>
    <p className="text-gray-300 text-sm">{year}</p>
    <div className="flex items-center gap-1">
      <Star className="fill-yellow-400 text-yellow-400" />
      <span className="text-white font-semibold">{rating}</span>
    </div>
  </div>
</div>
```

---

#### 3. `/movies/[id]` - Detalle de Película
**Descripción**: Vista detallada de película con **hero section + lista de reviews**.

**Elementos**:
- **Hero section**:
  - Poster grande (izquierda)
  - Info derecha: título, año, género (badge colorido), rating promedio (grande y destacado)
  - Descripción breve (opcional)
- **Botón "Write Review"** → Abre `ReviewModal`
- **Lista de Reviews**:
  - Cada review: avatar colorido generado del nombre, autor, rating (stars), contenido, fecha
  - Ordenadas por fecha desc
  - Si no hay reviews: mensaje "No reviews yet. Be the first!"

**Comportamiento**:
- Fetch: `GET /movies/:id` (retorna película + reviews)
- Click "Write Review" → Abre modal
- Después de crear review → Revalida data (SWR), rating actualizado automáticamente

---

#### 4. `/discover` - Discover con IA
**Descripción**: Página de descubrimiento con **película aleatoria + carousel de 3 anécdotas de IA**.

**Elementos**:
- Card grande de película (poster, título, año, género, rating)
- **Carousel/Slider** con las 3 anécdotas:
  - Navegación con flechas laterales
  - Dots indicators
  - Animación suave entre slides
  - Iconos temáticos (🎬, 💡, 🎥) para cada anécdota
- Botón grande "Discover Another Movie" → Carga nueva película

**Comportamiento**:
- Fetch inicial: `GET /movies/discover`
- Muestra `data[0].movie` y `data[0].anecdotes` (array de 3 strings)
- Click "Discover Another" → Nuevo fetch, actualiza película y anécdotas

**DiscoverCard** (componente):
```tsx
<div className="max-w-4xl mx-auto">
  <div className="grid md:grid-cols-2 gap-8">
    <img src={poster} className="rounded-lg shadow-xl" />
    <div>
      <Badge>{genre}</Badge>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-gray-600">{year}</p>
      <div className="flex items-center gap-2">
        <Star className="fill-yellow-400" />
        <span className="text-2xl font-bold">{rating}</span>
      </div>
    </div>
  </div>

  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">🎬 Behind the Scenes</h2>
    <Carousel>
      {anecdotes.map((anecdote, i) => (
        <div key={i} className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
          <p className="text-lg">{anecdote}</p>
        </div>
      ))}
    </Carousel>
  </div>

  <button onClick={loadNew} className="mt-8 btn-primary">
    Discover Another Movie 🎲
  </button>
</div>
```

---

### Componentes Globales

#### ReviewModal (Modal/Drawer)
**Trigger**: Botón "Write Review" en `/movies/[id]`

**Contenido**:
- Header: "Write a Review for {movieTitle}"
- Form (React Hook Form + Zod):
  - **Author** (text input, requerido)
  - **Rating** (star selector interactivo, 0-10, requerido)
  - **Content** (textarea, requerido, min 10 chars)
- Botones: "Cancel" | "Submit Review"

**Validación con Zod**:
```typescript
const reviewSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(10, 'Review must be at least 10 characters'),
  rating: z.number().int().min(0).max(10)
})
```

**Comportamiento**:
- Submit → `POST /movies/:movieId/reviews`
- Success → Modal cierra, toast "Review submitted!", revalida data
- Error → Muestra mensaje de error inline

---

#### FAB (Floating Action Button)
**Posición**: Fixed bottom-right (con z-index alto)

**Apariencia**:
- Botón circular grande con icono "+"
- Gradiente vibrante (púrpura a rosa)
- Sombra colorida
- Hover: scale + rotate 90deg

**Comportamiento**:
- Click → Abre modal "Add New Movie"
- Modal con formulario completo:
  - **Title** (text, requerido)
  - **Year** (number, 1888 - año actual + 5, requerido)
  - **Genre** (select dropdown con opciones del enum, requerido)
  - **Rating** (slider 0-10 o star selector, requerido)
  - **Poster URL** (text, opcional, validar URL)
- Submit → `POST /movies`
- Success → Redirect a `/movies/[newId]` o cerrar modal + toast

**Validación con Zod**:
```typescript
const movieSchema = z.object({
  title: z.string().min(1, 'Title required'),
  year: z.number().int().min(1888).max(new Date().getFullYear() + 5),
  genre: z.enum(['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCIFI', 'THRILLER']),
  rating: z.number().min(0).max(10),
  poster: z.string().url('Invalid URL').optional().or(z.literal(''))
})
```

---

## 🛠️ Código de Integración con API

### lib/api.ts
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Movie {
  id: number
  title: string
  year: number
  genre: 'ACTION' | 'COMEDY' | 'DRAMA' | 'HORROR' | 'SCIFI' | 'THRILLER'
  rating: number
  poster?: string
  createdAt: string
  updatedAt: string
}

interface Review {
  id: number
  movieId: number
  author: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
}

interface DiscoverData {
  movie: Movie
  anecdotes: string[]
}

// GET /movies con filtros opcionales
export async function getMovies(filters?: {
  genre?: string
  minRating?: number
}): Promise<Movie[]> {
  const params = new URLSearchParams()
  if (filters?.genre) params.append('genre', filters.genre)
  if (filters?.minRating) params.append('minRating', filters.minRating.toString())

  const res = await fetch(`${API_BASE}/movies?${params}`)
  if (!res.ok) throw new Error('Failed to fetch movies')
  const json = await res.json()
  return json.data // Array
}

// GET /movies/:id (con reviews)
export async function getMovieById(id: string): Promise<Movie & { reviews: Review[] }> {
  const res = await fetch(`${API_BASE}/movies/${id}`)
  if (!res.ok) throw new Error('Movie not found')
  const json = await res.json()
  return json.data[0] // Primer elemento del array
}

// POST /movies
export async function createMovie(data: {
  title: string
  year: number
  genre: string
  rating: number
  poster?: string
}): Promise<Movie> {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create movie')
  }
  const json = await res.json()
  return json.data[0]
}

// POST /movies/:movieId/reviews
export async function createReview(movieId: string, data: {
  author: string
  content: string
  rating: number
}): Promise<Review> {
  const res = await fetch(`${API_BASE}/movies/${movieId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create review')
  }
  const json = await res.json()
  return json.data
}

// GET /movies/discover (IA)
export async function discoverMovie(): Promise<DiscoverData> {
  const res = await fetch(`${API_BASE}/movies/discover`)
  if (!res.ok) throw new Error('Failed to discover movie')
  const json = await res.json()
  return json.data[0] // { movie: Movie, anecdotes: string[] }
}
```

---

### lib/utils.ts
```typescript
// Obtener color y emoji por género
export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    ACTION: 'bg-red-500 text-white border-red-600',
    COMEDY: 'bg-yellow-400 text-black border-yellow-500',
    DRAMA: 'bg-purple-500 text-white border-purple-600',
    HORROR: 'bg-gray-800 text-white border-gray-900',
    SCIFI: 'bg-blue-500 text-white border-blue-600',
    THRILLER: 'bg-orange-500 text-white border-orange-600'
  }
  return colors[genre] || 'bg-gray-400 text-white'
}

export function getGenreEmoji(genre: string): string {
  const emojis: Record<string, string> = {
    ACTION: '🎬',
    COMEDY: '😂',
    DRAMA: '🎭',
    HORROR: '👻',
    SCIFI: '🚀',
    THRILLER: '💀'
  }
  return emojis[genre] || '🎥'
}

// Generar avatar colorido desde nombre
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400',
    'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
```

---

## 🎯 Flujos de Usuario Clave

### 1. Búsqueda desde Landing
```
/ → Usuario escribe "inception" en SearchBar
  → Fetch GET /movies
  → Filtrar client-side por título que contenga "inception"
  → Mostrar MovieCard con resultado
  → Click en card → Navega a /movies/1
```

### 2. Filtrar Catálogo
```
/movies → Usuario selecciona "Genre: SCIFI" + "Min Rating: 8"
        → Fetch GET /movies?genre=SCIFI&minRating=8
        → Grid actualiza con resultados filtrados
```

### 3. Crear Review
```
/movies/1 → Click "Write Review"
          → ReviewModal aparece
          → Completa: author="Jane", rating=10, content="Amazing!"
          → Click "Submit"
          → POST /movies/1/reviews
          → Success: Modal cierra, toast "Review submitted!"
          → Reviews list revalida (SWR)
          → Rating promedio actualizado automáticamente (backend)
```

### 4. Discover con IA
```
/discover → Fetch GET /movies/discover
          → Muestra película + 3 anécdotas en carousel
          → Usuario navega carousel (flechas/dots)
          → Click "Discover Another"
          → Nuevo fetch, actualiza película
```

### 5. Agregar Película
```
Cualquier página → Click FAB (+)
                 → Modal aparece
                 → Completa form validado
                 → Submit → POST /movies
                 → Success → Redirect /movies/[newId]
```

---

## 🎨 Detalles de Diseño UX

### Colorful & Playful Elements
- ✅ **Gradientes sutiles** en backgrounds (from-purple-50 to-pink-50)
- ✅ **Animaciones hover** con scale-105, brightness increase
- ✅ **Rating stars** con animación fill (framer-motion)
- ✅ **Badges de género** con sombras coloridas (shadow-lg)
- ✅ **Transiciones suaves** (transition-all duration-300)
- ✅ **Emojis temáticos** en género badges
- ✅ **Toast notifications** coloridas para feedback
- ✅ **Skeleton loaders** playful durante carga

### Responsividad
- **Mobile** (< 768px): Stack vertical, grid 1-2 columnas, hamburger menu
- **Tablet** (768-1024px): Grid 2-3 columnas, sidebar filters
- **Desktop** (> 1024px): Grid 4-5 columnas, filtros laterales

### Accesibilidad
- Labels ARIA para modales, botones, inputs
- Focus states visibles (ring-2 ring-offset-2)
- Contraste mínimo WCAG AA
- Keyboard navigation: Tab, Enter, Esc
- Alt text en imágenes de posters

---

## ✅ Testing y Verificación

### Checklist de Funcionalidades
- [ ] GET /movies carga grid correctamente
- [ ] Filtros de género y rating actualizan grid
- [ ] Buscador filtra por título en tiempo real
- [ ] GET /movies/:id muestra detalle + reviews
- [ ] Modal "Write Review" valida campos y crea review
- [ ] Rating promedio se actualiza tras crear review (automático)
- [ ] GET /movies/discover carga película + 3 anécdotas
- [ ] Carousel de anécdotas navegable (flechas, dots)
- [ ] FAB modal crea película con validación
- [ ] Colores de género consistentes en toda la app
- [ ] Responsive en mobile/tablet/desktop
- [ ] Manejo de errores (404, 500, network error)

### Error Handling
- **404 película no encontrada**: Página con mensaje amigable "Movie not found" + botón "Back to Catalog"
- **500 server error**: Toast/notification roja con mensaje de error
- **Validación fallida**: Mensajes inline rojos bajo inputs
- **Network error**: Toast "Network error. Please try again." + retry button

---

## 📦 Entregables Esperados

### Archivos Core
1. `app/page.tsx` - Landing con SearchBar
2. `app/movies/page.tsx` - Catálogo con filtros
3. `app/movies/[id]/page.tsx` - Detalle película + reviews
4. `app/discover/page.tsx` - Discover con IA
5. `components/SearchBar.tsx` - Buscador hero
6. `components/MovieCard.tsx` - Card película
7. `components/ReviewModal.tsx` - Modal crear review
8. `components/DiscoverCard.tsx` - Card discover con carousel
9. `components/FAB.tsx` - Floating Action Button
10. `components/GenreFilter.tsx` - Filtro género
11. `components/RatingFilter.tsx` - Filtro rating
12. `lib/api.ts` - Funciones fetch API
13. `lib/utils.ts` - Helpers (colores, emojis, avatars)
14. `lib/schemas.ts` - Validaciones Zod

### Dependencias
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "swr": "^2.2.4",
    "lucide-react": "^0.294.0",
    "embla-carousel-react": "^8.0.0",
    "sonner": "^1.2.0",
    "tailwindcss": "^3.3.0"
  }
}
```

---

## 🚀 Instrucciones Finales para v0.app

### Prioridades
1. **Implementar primero**: Landing (buscador) + Catálogo con filtros
2. **Luego**: Detalle película + ReviewModal
3. **Después**: Discover con carousel IA
4. **Finalmente**: FAB modal crear película

### Notas Técnicas Críticas
- ⚠️ **Response format**: Backend retorna `data` SIEMPRE como array
- ⚠️ **Rating update**: Automático al crear review, NO hacer update manual
- ⚠️ **Genre enum**: Usar uppercase (ACTION, no "Action")
- ⚠️ **CORS**: Backend tiene CORS habilitado, no hay problemas de CORS
- ⚠️ **Validaciones**: Seguir exactamente las validaciones del backend

### Estilo
- Usa **Tailwind utility classes** para todo el styling
- Sigue el **theme colorful & playful** con paleta vibrante
- **Animaciones suaves** en hover, transiciones, micro-interacciones
- **Componentes shadcn/ui** como base, customizados con colores

---

**🎬 ¡Listo para generar el frontend perfecto en v0.app! 🚀**
