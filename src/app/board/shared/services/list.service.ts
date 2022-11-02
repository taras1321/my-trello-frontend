import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { CreateListRequestInterface } from '../types/create-list-request.interface'
import { CreateListResponseInterface } from '../types/create-list-response.interface'
import { EditListResponseInterface } from '../types/edit-list-response.interface'

@Injectable({ providedIn: 'root' })
export class ListService {
    
    constructor(private http: HttpClient) {
    }
    
    addList(listData: CreateListRequestInterface): Observable<CreateListResponseInterface> {
        const url = environment.apiUrl + '/list'
        return this.http.post<CreateListResponseInterface>(url, listData)
    }
    
    deleteList(listId: number): Observable<void> {
        const url = `${environment.apiUrl}/list/${listId}`
        return this.http.delete<void>(url)
    }
    
    editList(listId: number, name: string): Observable<EditListResponseInterface> {
        const url = `${environment.apiUrl}/list/${listId}`
        return this.http.put<EditListResponseInterface>(url, { name })
    }
    
}