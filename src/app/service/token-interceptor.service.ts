import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {

    const tokenizedReq = req.clone({
      setHeaders: {
        'X-api-key': ''
      }
    });

    return next.handle(tokenizedReq);
  }
}
