/**
 * Standard API Response Utilities
 */

export const sendSuccess = (res, data, status = 200) => {
  return res.status(status).json(data);
};

export const sendError = (res, message = "Internal Server Error", status = 500) => {
  return res.status(status).json({ error: message });
};
