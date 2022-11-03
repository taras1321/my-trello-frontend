import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { UserInterface } from '../../shared/types/user.interface'

@Injectable({ providedIn: 'root' })
export class SettingsService {
    
    constructor(private http: HttpClient) {
    }
    
    getUserData(): Observable<UserInterface> {
        const url = environment.apiUrl + '/user'
        return this.http.get<UserInterface>(url)
    }
    
    changeName(name: string): Observable<{ name: string }> {
        const url = environment.apiUrl + '/change-name'
        return this.http.put<{ name: string }>(url, { name })
    }
    
    changeEmail(email: string): Observable<{ email: string }> {
        const url = environment.apiUrl + '/change-email'
        return this.http.put<{ email: string }>(url, { email })
    }
    
    changePassword(currentPassword: string, newPassword: string): Observable<void> {
        const url = environment.apiUrl + '/change-password'
        return this.http.put<void>(url, { currentPassword, newPassword })
    }
    
    deleteAccount(): Observable<void> {
        const url = environment.apiUrl + '/delete-account'
        return this.http.delete<void>(url)
    }
    
}