import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { LoginRequestInterface } from '../../auth/types/login-request.interface'
import { RegisterRequestInterface } from '../../auth/types/registration-request.interface'
import { AuthUserInterface } from '../types/auth-user.interface'

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    constructor(private http: HttpClient) {
    }
    
    setUserData(authData: AuthUserInterface): void {
        localStorage.setItem('token', authData.token)
    }
    
    login(data: LoginRequestInterface): Observable<AuthUserInterface> {
        const url = environment.apiUrl + '/login'
        
        return this.http.post<AuthUserInterface>(url, data)
            .pipe(tap(this.setUserData.bind(this)))
    }
    
    registration(data: RegisterRequestInterface): Observable<AuthUserInterface> {
        const url = environment.apiUrl + '/registration'
        
        return this.http.post<AuthUserInterface>(url, data)
            .pipe(tap(this.setUserData.bind(this)))
    }
    
    logout() {
        localStorage.removeItem('token')
    }
    
}
