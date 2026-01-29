import * as reviewService from '#services/reviewService.js';

export async function getByMovie(req, res) {
  try {
    const { movieId } = req.params;
    const reviews = await reviewService.getReviewsByMovie(movieId);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}