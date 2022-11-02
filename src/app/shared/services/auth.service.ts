import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { LoginRequestInterface } from '../types/login-request.interface'
import { RegisterRequestInterface } from '../types/registration-request.interface'
import { AuthUserResponseInterface } from '../types/auth-user-response.interface'

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    constructor(private http: HttpClient) {
    }
    
    setUserData(authData: AuthUserResponseInterface): void {
        localStorage.setItem('token', authData.token)
    }
    
    login(data: LoginRequestInterface): Observable<AuthUserResponseInterface> {
        const url = environment.apiUrl + '/login'
        
        return this.http.post<AuthUserResponseInterface>(url, data)
            .pipe(tap(this.setUserData.bind(this)))
    }
    
    registration(data: RegisterRequestInterface): Observable<AuthUserResponseInterface> {
        const url = environment.apiUrl + '/registration'
        
        return this.http.post<AuthUserResponseInterface>(url, data)
            .pipe(tap(this.setUserData.bind(this)))
    }
    
    logout() {
        localStorage.removeItem('token')
    }
    
}
