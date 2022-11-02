import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { popupAnimations } from '../shared/animations/popup-animations'
import { BoardService } from '../shared/services/board.service'
import { sortType } from './types/sort.type'

@Component({
    selector: 'app-boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.scss'],
    animations: popupAnimations
})
export class BoardsComponent implements OnInit {
    
    @ViewChild('searchInput') searchInputRef: ElementRef<HTMLInputElement>
    
    readonly limit: number = 6
    loading: boolean
    loadMoreLoading: boolean
    isFavoritePage: boolean
    search: string = ''
    timoutId: ReturnType<typeof setTimeout>
    showAddBoardPopup: boolean = false
    activeBoardId: number
    showBoardMembersPopup: boolean = false
    
    constructor(public boardService: BoardService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.isFavoritePage = this.router.url === '/favorite'
        this.getBoards()
    }
    
    getBoards(): void {
        this.loading = true
        
        this.boardService.getAll(
            this.isFavoritePage,
            this.isSortByName(),
            this.search,
            this.limit,
            0
        ).subscribe((boardsResponse) => {
            this.boardService.boards = boardsResponse.boards
            this.boardService.boardsCount = boardsResponse.boardsCount
            this.loading = false
        })
    }
    
    searchFocus(): void {
        this.searchInputRef.nativeElement.focus()
    }
    
    toggleFavorite(event: Event, boardId: number): void {
        event.stopPropagation()
        event.preventDefault()
        
        const board = this.boardService.boards.find(board => board.id === boardId)
        
        if (!board) {
            return
        }
        
        board.liked = !board.liked
        
        if (this.isFavoritePage) {
            this.boardService.boards = this.boardService.boards
                .filter(board => board.id !== boardId)
            this.boardService.boardsCount--
        }
        
        this.boardService.toggleFavorite(boardId).subscribe({
            error: () => {
                board.liked = !board.liked
            }
        })
    }
    
    onMembersClick(event: Event, boardId: number): void {
        event.stopPropagation()
        event.preventDefault()
        
        this.activeBoardId = boardId
        this.showBoardMembersPopup = true
    }
    
    toggleSort(sort: sortType): void {
        if (sort === this.boardService.sortBy) {
            return
        }
        
        this.boardService.sortBy = sort
        this.getBoards()
    }
    
    onSearchChange(): void {
        if (this.timoutId) {
            clearTimeout(this.timoutId)
        }
        
        this.loading = true
        
        this.timoutId = setTimeout(() => {
            this.getBoards()
        }, 500)
    }
    
    isSortByName(): boolean {
        return this.boardService.sortBy === 'name'
    }
    
    loadMoreBoards(): void {
        this.loadMoreLoading = true
        
        this.boardService.getAll(
            this.isFavoritePage,
            this.isSortByName(),
            this.search,
            this.limit,
            this.boardService.boards.length
        ).subscribe((boardsResponse) => {
            this.boardService.boards = [...this.boardService.boards, ...boardsResponse.boards]
            this.boardService.boardsCount = boardsResponse.boardsCount
            this.loadMoreLoading = false
        })
    }
    
}
