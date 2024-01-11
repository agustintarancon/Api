//Validacion del token
const jwt = require("jsonwebtoken");

const jwtValidator = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  //Verificamos si existe la cabecera de autorización en la solicitud. Si no existe devolvemos error
  if (!authHeader) { 
    return res.status(401).json({ message: "El token es invalido" });
  }
  //A continuacion se divide la cadena de la cabecera de autorización en dos partes: el prefijo "Bearer" y el token propiamente dicho. Verifica que el prefijo sea "Bearer" y que haya un token presente. Si no cumple con estas condiciones, responde con un código de estado 401 y un mensaje indicando que el token es inválido.
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "El token es invalido" });
  }
  //Luego utiliza la función verify de jsonwebtoken para verificar la autenticidad del token. Se utiliza una clave secreta (SECRET_KEY) almacenada en las variables de entorno para descifrar el token. Si la verificación falla devolvemos un error. Si la verificación tiene éxito, llama a la función next(), permitiendo que la solicitud continúe hacia el siguiente middleware o controlador.
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