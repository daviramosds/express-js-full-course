import { NextFunction, Response } from "express";
import { RequestFindUserIndex } from "../types/users";
import { fakeUsers } from "./constants";

export const resolveIndexByUserId = (
  req: RequestFindUserIndex,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  const index = fakeUsers.findIndex(user => user.id === parsedId);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  req.findUserIndex = index;
  next();
};