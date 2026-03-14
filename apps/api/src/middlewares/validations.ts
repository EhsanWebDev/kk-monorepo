import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const handleBodyValidation = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, success, data } = z.safeParse(schema, req.body);
    if (!success) {
      const formattedErrors = z.flattenError(error);
      return res.status(400).json({ errors: formattedErrors });
    }
    req.body = data;
    next();
  };
};
