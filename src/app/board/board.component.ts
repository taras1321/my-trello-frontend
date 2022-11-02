import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import {
    AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild
} from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription, switchMap } from 'rxjs'
import { BoardService } from '../shared/services/board.service'
import { ChangeOrderInterface } from '../shared/types/change-order.interface'
import { FullBoardInterface } from '../shared/types/full-board.interface'
import { ListService } from './shared/services/list.service'
import { CreateListRequestInterface } from './shared/types/create-list-request.interface'
import { DragDropInterface } from './shared/types/drag-drop.interface'
import { DroppedCardInterface } from './shared/types/dropped-card.interface'

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
    
    @ViewChild('addList') addListRef: ElementRef<HTMLDivElement>
    @ViewChild('addListButton') addListButtonRef: ElementRef<HTMLButtonElement>
    @ViewChild('addListInput') addListInputRef: ElementRef<HTMLInputElement>
    @ViewChild('board') boardRef: ElementRef<HTMLDivElement>
    
    @HostListener('window:keyup.Escape') escape() {
        this.showAddListForm = false
    }
    
    boardLoading: boolean = false
    boardData: FullBoardInterface
    previousListIdOfDroppedCard: number
    droppedCardId: number
    showAddListForm: boolean = false
    isDragging: boolean = false
    newListTitle: string = ''
    newListLoading: boolean = false
    isMouseDown: boolean = false
    scrollSizeAfterMouseDown: number
    positionXAfterMouseDown: number
    intervalId: ReturnType<typeof setInterval>
    scrollDirection: 'right' | 'left' | null = null
    pixelToScroll: number | null = null
    subscriptions: Subscription[] = []
    
    constructor(
        private boardService: BoardService,
        private listService: ListService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }
    
    ngOnInit(): void {
        this.boardLoading = true
        
        const sub = this.route.params
            .pipe(switchMap((params: Params) => {
                return this.boardService.getBoardById(+params['id'])
            }))
            .subscribe({
                next: (boardData) => {
                    this.boardData = boardData
                    this.boardLoading = false
                },
                error: () => {
                    this.router.navigate(['/'])
                }
            })
        
        this.subscriptions.push(sub)
    }
    
    ngAfterViewInit(): void {
        document.addEventListener('mouseup', this.mouseUpCb.bind(this))
        document.addEventListener('mousemove', this.mouseMoveCb.bind(this))
        document.addEventListener('mousemove', this.scrollWhileDragging.bind(this))
        document.addEventListener('touchmove', this.scrollWhileDragging.bind(this))
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
        
        document.removeEventListener('mouseup', this.mouseUpCb.bind(this))
        document.removeEventListener('mousemove', this.mouseMoveCb.bind(this))
        document.removeEventListener('mousemove', this.scrollWhileDragging.bind(this))
        document.removeEventListener('touchmove', this.scrollWhileDragging.bind(this))
    }
    
    mouseUpCb() {
        this.isMouseDown = false
    }
    
    mouseMoveCb(event: MouseEvent) {
        if (this.isMouseDown) {
            const positionX = event.clientX
            
            this.boardRef.nativeElement.scrollLeft =
                this.scrollSizeAfterMouseDown - (positionX - this.positionXAfterMouseDown)
        }
    }
    
    scrollWhileDragging(event: MouseEvent | TouchEvent) {
        if (!this.isDragging) {
            return
        }
        
        const widthToLeftBorder = event instanceof MouseEvent ? event.clientX :
            event.touches[0].clientX
        const widthToRightBorder = window.innerWidth - widthToLeftBorder
        const widthToBorderToStartScrolling = window.innerWidth * 0.2
        
        let pixelsToScroll = 2
        let scrollDirection: 'left' | 'right'
        
        if ((widthToRightBorder / widthToBorderToStartScrolling < 0.3 ||
            widthToLeftBorder / widthToBorderToStartScrolling < 0.3) && window.innerWidth > 768
        ) {
            pixelsToScroll = 4
        } else if ((widthToRightBorder / widthToBorderToStartScrolling < 0.6 ||
            widthToLeftBorder / widthToBorderToStartScrolling < 0.6) && window.innerWidth > 768
        ) {
            pixelsToScroll = 3
        }
        
        if (widthToRightBorder < widthToBorderToStartScrolling) {
            scrollDirection = 'right'
        } else if (widthToLeftBorder < widthToBorderToStartScrolling) {
            scrollDirection = 'left'
        } else {
            if (this.intervalId) {
                clearInterval(this.intervalId)
            }
            
            this.pixelToScroll = null
            this.scrollDirection = null
            
            return
        }
        
        if (this.pixelToScroll === pixelsToScroll && this.scrollDirection === scrollDirection) {
            return
        }
        
        this.pixelToScroll = pixelsToScroll
        
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
        
        if (scrollDirection === 'right') {
            this.scrollDirection = 'right'
            
            this.intervalId = setInterval(() => {
                this.boardRef.nativeElement.scrollLeft += pixelsToScroll
            }, 5)
        } else if (scrollDirection === 'left') {
            this.scrollDirection = 'left'
            
            this.intervalId = setInterval(() => {
                this.boardRef.nativeElement.scrollLeft -= pixelsToScroll
            }, 5)
        }
    }
    
    onMouseDown(event: MouseEvent): void {
        this.isMouseDown = true
        this.scrollSizeAfterMouseDown = this.boardRef.nativeElement.scrollLeft
        this.positionXAfterMouseDown = event.clientX
    }
    
    drop({ event, listId }: DragDropInterface) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            )
        }
        
        const data: ChangeOrderInterface = {
            boardId: this.boardData.id,
            newListId: listId,
            newCardPosition: event.currentIndex,
            cardId: this.droppedCardId
        }
        
        const sub = this.boardService.changeOrder(data).subscribe()
        this.subscriptions.push(sub)
    }
    
    cardDropped({ listId, cardId }: DroppedCardInterface): void {
        this.previousListIdOfDroppedCard = listId
        this.droppedCardId = cardId
    }
    
    dragStart(): void {
        this.isDragging = true
    }
    
    dragEnd(): void {
        this.isDragging = false
        this.scrollDirection = null
        this.pixelToScroll = null
        
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
    
    onBoardClick(event: Event): void {
        if (this.addListButtonRef?.nativeElement.contains(event.target as HTMLElement)) {
            this.showAddListForm = true
            
            setTimeout(() => {
                this.addListInputRef?.nativeElement.focus()
                this.boardRef.nativeElement.scrollLeft = this.boardRef.nativeElement.scrollWidth
            })
        }
        
        if (!this.addListRef?.nativeElement.contains(event.target as HTMLElement)) {
            this.showAddListForm = false
        }
    }
    
    addNewList(): void {
        if (this.newListTitle.trim().length === 0) {
            return
        }
        
        this.newListLoading = true
        const listData: CreateListRequestInterface = {
            name: this.newListTitle, boardId: this.boardData.id
        }
        
        const sub = this.listService.addList(listData).subscribe((newList) => {
            this.boardData.lists.push({ ...newList, cards: [] })
            this.newListLoading = false
            this.newListTitle = ''
            
            setTimeout(() => {
                this.boardRef.nativeElement.scrollLeft = this.boardRef.nativeElement.scrollWidth
            })
        })
        
        this.subscriptions.push(sub)
    }
    
    onAddListButtonMouseDown(event: MouseEvent): void {
        event.stopPropagation()
    }
    
}
