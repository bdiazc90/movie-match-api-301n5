export const sendSuccess = (res, data) => {
  const arr = Array.isArray(data) ? data : [data]; // Siempre retornará un arreglo.
  res.json({ success: true, data: arr, count: arr.length });
};

export const sendError = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};