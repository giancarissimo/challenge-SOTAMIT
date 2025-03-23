import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Valores por defecto
    let category = 'global';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as any
        category = resp.category || category
        message = resp.message || exception.message
      } else {
        message = exceptionResponse
      }
    }

    // Solo se agregan detalles si está en modo desarrollo, para tener más información de errores no registrados correctamente.
    // const details = process.env.NODE_ENV !== 'production' ? { exception } : undefined

    const errorResponse = {
      category: category,
      status: 'error',
      code: statusCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      // details: details
    };

    response.status(statusCode).json(errorResponse);
  };
};
