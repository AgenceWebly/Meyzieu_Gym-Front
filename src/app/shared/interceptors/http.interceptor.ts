import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://localhost:8080/api')) {
    req = req.clone({
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  return next(req);
};
