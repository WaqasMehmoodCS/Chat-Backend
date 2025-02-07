import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = await req.cookies.login;
    
    if (!token) return res.status(403).json({ message: "Access Denied" });

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) return res.status(403).json({ message: "Access Denied" });

    req.user = verifyToken;

    next();
  } catch (error) {
    console.log(error);
  }
};
