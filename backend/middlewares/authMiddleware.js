import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1]; // Bearer <token>
    jwt.verify(token, "CCG3ZNARCH", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default authMiddleware;
