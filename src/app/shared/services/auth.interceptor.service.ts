import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, Observable, throwError } from 'rxjs'
import { AuthService } from './auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(
        private userService: AuthService,
        private router: Router
    ) {
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token')
        
        request = request.clone({
            setHeaders: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        })
        
        return next.handle(request)
            .pipe(catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.userService.logout()
                    this.router.navigate(['/login'])
                }
                
                return throwError(() => error)
            }))
    }
    
}
