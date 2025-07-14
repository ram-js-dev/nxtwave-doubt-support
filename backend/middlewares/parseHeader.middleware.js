import jwt from "jsonwebtoken";

const parseHeader = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const jwtToken = authHeader?.split(" ")[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      res.status(403).send({ message: err.message });
      return;
    }
    req.userId = payload.userId;
    req.role = payload.role;
    next();
  });
};

export default parseHeader;
