// src/common/middleware/logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now(); // Record the start time of the request

    // Use a listener to log the response time once the response is finished
    res.on('finish', () => {
      const end = Date.now(); // Record the end time when the response is finished
      const responseTime = end - start;
      const statusCode = res.statusCode; // Get the response status code
      console.log(
        `Request Path: ${req.originalUrl} | Response Time: ${responseTime}ms | Status Code: ${statusCode}`
      );
    });

    next(); // Pass control to the next middleware
  }
}
