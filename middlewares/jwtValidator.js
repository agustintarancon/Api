//Validacion del token
const jwt = require("jsonwebtoken");

const jwtValidator = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "El token es invalido" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "El token es invalido" });
  }

  const secretKey = process.env.SECRET_KEY;
  jwt.verify(token, secretKey, (error) => {
    if (error) {
      return res.status(401).json({ message: "El token es invalido", error });
    }
    next();
  });
};

module.exports = {
  jwtValidator,
};