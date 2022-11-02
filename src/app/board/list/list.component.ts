import {
    AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output,
    ViewChild
} from '@angular/core'
import { Subscription } from 'rxjs'
import { popupAnimations } from '../../shared/animations/popup-animations'
import { CardInterface } from '../../shared/types/card.interface'
import { ListInterface } from '../../shared/types/list.interface'
import { CardService } from '../shared/services/card.service'
import { ListService } from '../shared/services/list.service'
import { CreateCardRequestInterface } from '../shared/types/create-card-request.interface'
import { DragDropInterface } from '../shared/types/drag-drop.interface'
import { DroppedCardInterface } from '../shared/types/dropped-card.interface'

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: popupAnimations
})
export class ListComponent implements AfterViewInit, OnDestroy {
    
    @ViewChild('addCardButton') addCardButtonRef: ElementRef<HTMLButtonElement>
    @ViewChild('textarea') textareaRef: ElementRef<HTMLTextAreaElement>
    @ViewChild('listMenu') listMenuRef: ElementRef<HTMLButtonElement>
    
    @Input() list: ListInterface
    @Input() allLists: ListInterface[]
    @Input() isCurrentUserAdmin: boolean
    @Output() drop = new EventEmitter<DragDropInterface>()
    @Output() cardDropped = new EventEmitter<DroppedCardInterface>()
    @Output() dragStart = new EventEmitter()
    @Output() dragEnd = new EventEmitter()
    
    @HostListener('window:keyup.Escape') escape() {
        this.hideForm()
    }
    
    showAddCardForm: boolean = false
    addCardLoading: boolean = false
    newCardName: string = ''
    showListMenu: boolean = false
    showDeleteListConfirm: boolean = false
    showEditListPopup: boolean = false
    deleteListLoading: boolean = false
    showCardPopup: boolean = false
    openedCard: CardInterface | null = null
    subscriptions: Subscription[] = []
    
    constructor(private cardService: CardService, private listService: ListService) {
    }
    
    ngAfterViewInit(): void {
        document.addEventListener('click', this.documentClickCb.bind(this))
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
        document.removeEventListener('click', this.documentClickCb.bind(this))
    }
    
    documentClickCb(event: Event) {
        if (this.addCardButtonRef?.nativeElement.contains(event.target as HTMLElement)) {
            this.showAddCardForm = true
            
            setTimeout(() => {
                this.textareaRef?.nativeElement.focus()
            })
        } else {
            this.hideForm()
        }
        
        if (!this.listMenuRef?.nativeElement.contains(event.target as HTMLElement)) {
            this.showListMenu = false
        }
    }
    
    onListMouseDown(event: MouseEvent): void {
        event.stopPropagation()
    }
    
    onAddCardFormClick(event: MouseEvent): void {
        event.stopPropagation()
    }
    
    onAddCard(): void {
        if (this.newCardName.trim().length === 0) {
            return
        }
        
        const cardData: CreateCardRequestInterface = {
            name: this.newCardName,
            listId: this.list.id
        }
        
        this.addCardLoading = true
        
        const sub = this.cardService.create(cardData).subscribe((card) => {
            this.list.cards.push({
                ...card,
                hasExecutor: false,
                executorId: null,
                commentsCount: 0,
                commentsCountByUser: []
            })
            
            this.addCardLoading = false
            this.newCardName = ''
        })
        
        this.subscriptions.push(sub)
    }
    
    hideForm() {
        this.showAddCardForm = false
        this.newCardName = ''
    }
    
    onTextAreaEnterDown(event: Event): void {
        event.preventDefault()
        this.onAddCard()
    }
    
    onShowDeleteListConfirm() {
        this.showDeleteListConfirm = true
        this.showListMenu = false
    }
    
    onShowEditListPopup() {
        this.showEditListPopup = true
        this.showListMenu = false
    }
    
    getDeleteListConfirmText(): string {
        return `Are you sure want to delete list "${this.list.name}"?`
    }
    
    onListDelete(): void {
        this.deleteListLoading = true
        
        const sub = this.listService.deleteList(this.list.id).subscribe(() => {
            const idx = this.allLists.findIndex(list => list.id === this.list.id)
            this.allLists.splice(idx, 1)
        })
        
        this.subscriptions.push(sub)
    }
    
    onCardClick(card: CardInterface): void {
        this.openedCard = card
        this.showCardPopup = true
    }
    
    onCloseCard(): void {
        this.showCardPopup = false
        this.openedCard = null
    }
    
}
