// import { type Request, type Response, type NextFunction } from 'express';

import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails= err

  // prisma client validation error
  if(err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You have provided field type or missing field!";
  }
  // prisma client known request error
  else if(err instanceof Prisma.PrismaClientKnownRequestError) {
    if(err.code === "P2002") {
      statusCode = 400;
      errorMessage = "You have provided duplicate field value!";
    }else if(err.code === "P2025") {
      statusCode = 404;
      errorMessage = "The requested resource was not found!";
    }else if(err.code === "P2003") {
      statusCode = 400;
      errorMessage = "foreign key constraint failed!";
    } 
  }
  else if(err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Unknown error occurred!";
  }else if(err instanceof Prisma.PrismaClientInitializationError) {
    if(err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed! Please check your database credentials.";
    }else if(err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Database server is not available!";
    }
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
