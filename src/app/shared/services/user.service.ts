import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { UserInterface } from '../types/user.interface'

@Injectable({ providedIn: 'root' })
export class UserService {
    
    constructor(private http: HttpClient) {
    }
    
    getUserByEmail(email: string): Observable<UserInterface> {
        const url = environment.apiUrl + '/user/by-email'
        return this.http.post<UserInterface>(url, { email })
    }
    
}