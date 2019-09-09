import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((err: HttpErrorResponse) => {
                    let errorMessage = '';

                    if (err.error instanceof ErrorEvent) { //client-side error
                        errorMessage = `An error occured: ${err.error.message}`;
                    } else { //server-side error
                        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
                    }

                    window.alert(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }
}