import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";
import { asyncWrapper } from "./asyncWrapper.js";
// import { User } from "../models/User.js";

export const auth = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new UnauthenticatedError("Invalid authentication"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, email } = payload;

    // true if it's a testUser or false if it's not.
    const testUser = email === "testUser@test.com";
    req.user = { userId, testUser };

    //! ------Optional ------
    // const user = await User.findById(payload.userId).select("-password");
    // req.user = user;
    //! ---------------------
    next();
  } catch (error) {
    return next(new UnauthenticatedError("Not authorized to access"));
  }
});
