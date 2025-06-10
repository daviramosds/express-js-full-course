import { NextFunction, Response } from "express";
import { RequestFindUserIndex } from "../types/users";
import { fakeUsers } from "./constants";

export const resolveIndexByUserId = (req: RequestFindUserIndex, res: Response, next: NextFunction) => {
  	const {
		params: { id },
	} = req;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return res.sendStatus(400);
	const findUserIndex = fakeUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return res.sendStatus(404);
	req.findUserIndex = findUserIndex;
	next();
}