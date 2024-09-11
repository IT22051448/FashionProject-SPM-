import jwt from "jsonwebtoken";

const genAuthToken = user => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });
};

export default genAuthToken;
