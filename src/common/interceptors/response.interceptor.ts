import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 获取 HTTP 状态码
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;
        return {
          data,
          success: statusCode >= 200 && statusCode <= 300,
        };
      }),
    );
  }
}
