import * as statsService from '#services/statsService.js';
import { sendSuccess, sendError } from '#lib/response.js';

export async function test(req, res) {
    const result = await statsService.getTest();
    res.json({ result: result });
}

export async function getStats(req, res) {
  try {
    const stats = await statsService.getDashboardStats();
    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}