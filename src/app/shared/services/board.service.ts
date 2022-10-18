import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { sortType } from '../../boards/types/sort.type'
import { viewType } from '../../boards/types/view.type'
import { AddMemberInterface } from '../types/add-member.interface'
import { BoardMembersInterface } from '../types/board-members.interface'
import { BoardInterface } from '../types/board.interface'
import { BoardsResponseInterface } from '../types/boards-response.interface'
import { CreateBoardResponseInterface } from '../types/create-board-response.interface'
import { CreateBoardInterface } from '../types/create-board.interface'
import { ToggleFavoriteInterface } from '../types/toggle-favorite.interface'

@Injectable({ providedIn: 'root' })
export class BoardService {
    
    boards: BoardInterface[] = []
    boardsCount: number
    view: viewType = 'grid'
    sortBy: sortType = 'data'
    
    constructor(private http: HttpClient) {
    }
    
    toggleFavorite(boardId: number): Observable<ToggleFavoriteInterface> {
        const url = `${environment.apiUrl}/board/like/${boardId}`
        return this.http.get<ToggleFavoriteInterface>(url)
    }
    
    getAll(
        favorite: boolean,
        sortByName: boolean,
        searchString: string,
        limit: number,
        offset: number
    ): Observable<BoardsResponseInterface> {
        const url = environment.apiUrl + '/board'
        let params = new HttpParams()
        
        if (sortByName) {
            params = params.append('order-by', 'name')
        }
        if (favorite) {
            params = params.append('favorite', true)
        }
        if (limit) {
            params = params.append('limit', limit)
        }
        if (offset) {
            params = params.append('offset', offset)
        }
        if (searchString && searchString.trim().length > 0) {
            params = params.append('search', searchString.trim())
        }
        
        return this.http.get<BoardsResponseInterface>(url, { params })
    }
    
    createBoard(newBoard: CreateBoardInterface): Observable<CreateBoardResponseInterface> {
        const url = `${environment.apiUrl}/board/create`
        return this.http.post<CreateBoardResponseInterface>(url, newBoard)
    }
    
    getBoardMembers(boardId: number): Observable<BoardMembersInterface> {
        const url = `${environment.apiUrl}/board/members/${boardId}`
        return this.http.get<BoardMembersInterface>(url)
    }
    
    addAdmin(data: AddMemberInterface): Observable<void> {
        const url = environment.apiUrl + '/board/add-admin'
        return this.http.post<void>(url, data)
    }
    
    addMember(data: AddMemberInterface): Observable<void> {
        const url = environment.apiUrl + '/board/add-member'
        return this.http.post<void>(url, data)
    }
    
    removeAdmin(data: AddMemberInterface): Observable<void> {
        const url = environment.apiUrl + '/board/remove-admin'
        return this.http.post<void>(url, data)
    }
    
    removeMember(data: AddMemberInterface): Observable<void> {
        const url = environment.apiUrl + '/board/remove-member'
        return this.http.post<void>(url, data)
    }
    
}