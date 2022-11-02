import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { CommentInterface } from '../types/comment.interface'
import { CreateCardRequestInterface } from '../types/create-card-request.interface'
import { CreateCardResponseInterface } from '../types/create-card-response.interface'
import { EditCardRequestInterface } from '../types/edit-card-request.interface'
import { FullCardInterface } from '../types/full-card.interface'

@Injectable({ providedIn: 'root' })
export class CardService {
    
    constructor(private http: HttpClient) {
    }
    
    create(cardData: CreateCardRequestInterface): Observable<CreateCardResponseInterface> {
        const url = environment.apiUrl + '/card'
        return this.http.post<CreateCardResponseInterface>(url, cardData)
    }
    
    getCardById(cardId: number): Observable<FullCardInterface> {
        const url = `${environment.apiUrl}/card/${cardId}`
        return this.http.get<FullCardInterface>(url)
    }
    
    setExecutor(userId: number | null, cardId: number): Observable<void> {
        const url = environment.apiUrl + '/card/set-executor'
        return this.http.post<void>(url, { userId, cardId })
    }
    
    editCard(cardData: EditCardRequestInterface, cardId: number): Observable<void> {
        const url = `${environment.apiUrl}/card/${cardId}`
        return this.http.put<void>(url, cardData)
    }
    
    deleteCard(cardId: number): Observable<void> {
        const url = `${environment.apiUrl}/card/${cardId}`
        return this.http.delete<void>(url)
    }
    
    addComment(text: string, cardId: number): Observable<CommentInterface> {
        const url = environment.apiUrl + '/comment'
        return this.http.post<CommentInterface>(url, { text, cardId })
    }
    
    deleteComment(commentId: number): Observable<void> {
        const url = `${environment.apiUrl}/comment/${commentId}`
        return this.http.delete<void>(url)
    }
    
}