import { NextFunction, Request, Response } from "express";

export const typedController = <T>(
  controller: (req: Request, res: Response) => Promise<T>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res).catch(next);
  };
};
