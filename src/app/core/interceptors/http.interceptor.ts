import { HttpInterceptorFn } from '@angular/common/http';
  import { tap } from 'rxjs';

  export const httpInterceptor: HttpInterceptorFn = (req, next) => {

   // TOKEN
    const token = 'fake-jwt-token';

    const novaReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // SEGUE COM A NOVA REQUEST + LOG RESPONSE
    return next(novaReq).pipe(
      tap({
        next: (event) => console.log('RESPONSE:', event),
        error: (error) => console.error('ERRO:', error)
      })
    );
  };

