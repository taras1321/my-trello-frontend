import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class BoardService {
    
    constructor(private http: HttpClient) {
    }
    
    getAll(): Observable<any> {
        const url = environment.apiUrl + '/board'
        return this.http.get(url)
    }
    
}