const jwt = require("jsonwebtoken");
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Please log in again." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "local-development-secret-change-me");
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Your session expired. Please log in again." });
  }
};
