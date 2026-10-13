// import { type Request, type Response, type NextFunction } from 'express';

import { NextFunction, Request, Response } from "express";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(500);
  res.json({
    message: "Error from global error handler",
    error: err,
  });
}

export default errorHandler;
