import {HttpInterceptorFn} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs';

export const testHeaderInterceptor: HttpInterceptorFn =
    (req, next) => {

        const modifiedReq = req.clone({
            headers: req.headers.set('x-test', environment.test.toString())
        });

        return next(modifiedReq).pipe(
            tap({
                next: (event) => {
                    if (event.type === 4) {
                        console.log('Response received in interceptor');
                    }
                },
                error: (error) => {
                    console.error('Error in interceptor:', error);
                }
            })
        );
    };
