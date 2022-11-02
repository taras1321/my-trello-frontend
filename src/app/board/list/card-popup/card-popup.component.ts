import {
    Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { popupAnimations } from '../../../shared/animations/popup-animations'
import { CardInterface } from '../../../shared/types/card.interface'
import { ListInterface } from '../../../shared/types/list.interface'
import { UserWithoutEmailType } from '../../../shared/types/user-without-email.type'
import { CardService } from '../../shared/services/card.service'
import { CommentInterface } from '../../shared/types/comment.interface'
import { EditCardRequestInterface } from '../../shared/types/edit-card-request.interface'
import { FullCardInterface } from '../../shared/types/full-card.interface'

@Component({
    selector: 'app-card-popup',
    templateUrl: './card-popup.component.html',
    styleUrls: ['./card-popup.component.scss'],
    animations: popupAnimations
})
export class CardPopupComponent implements OnInit, OnDestroy {
    
    @Input() currentList: ListInterface
    @Input() currentCard: CardInterface | null
    @Output() onClose = new EventEmitter()
    
    @HostListener('window:keyup.Escape') escape() {
        this.editCard()
    }
    
    loading: boolean = false
    card: FullCardInterface
    form: FormGroup
    showSelectOptions: boolean = false
    showDeleteCardConfirm: boolean = false
    deleteLoading: boolean = false
    commentText: string = ''
    createCommentLoading: boolean = false
    showDeleteCommentConfirm: boolean = false
    activeCommentId: number | null = null
    deleteCommentLoading: boolean = false
    subscriptions: Subscription[] = []
    
    constructor(private cardService: CardService) {
    }
    
    ngOnInit(): void {
        if (!this.currentCard) {
            this.onClose.emit()
            return
        }
        
        this.loading = true
        
        const sub = this.cardService.getCardById(this.currentCard.id).subscribe((card) => {
            this.card = card
            this.loading = false
            
            this.form = new FormGroup({
                name: new FormControl(this.card.name, Validators.required),
                description: new FormControl(this.card.description)
            })
        })
        
        this.subscriptions.push(sub)
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    onSelectClick(event: Event): void {
        event.stopPropagation()
        this.showSelectOptions = !this.showSelectOptions
    }
    
    onOptionClick(event: Event, user: UserWithoutEmailType | null): void {
        event.stopPropagation()
        
        this.card.executor = user
        this.showSelectOptions = false
        const userId = user?.id ?? null
        
        if (this.currentCard) {
            this.currentCard.hasExecutor = !!user
            this.currentCard.executorId = user?.id ?? null
        }
        
        const sub = this.cardService.setExecutor(userId, this.card.id).subscribe()
        this.subscriptions.push(sub)
    }
    
    onPopup(): void {
        this.showSelectOptions = false
    }
    
    getOptionName(userId: number, userName: string): string {
        return this.card.currentUserId === userId ? userName + ' (you)' : userName
    }
    
    editCard(): void {
        if (!this.currentCard || !this.card.isCurrentUserAdmin) {
            return
        }
        
        const cardData: EditCardRequestInterface = {
            description: this.form.value.description
        }
        
        if (this.form.value.name.trim().length > 0) {
            this.currentCard.name = this.form.value.name
            cardData.name = this.form.value.name
        }
        
        const sub = this.cardService.editCard(cardData, this.card.id).subscribe()
        this.subscriptions.push(sub)
    }
    
    onCardDelete(): void {
        this.deleteLoading = true
        
        const sub = this.cardService.deleteCard(this.card.id).subscribe(() => {
            this.onClose.emit()
            const idx = this.currentList.cards.findIndex(card => card.id === this.card.id)
            this.currentList.cards.splice(idx, 1)
        })
        
        this.subscriptions.push(sub)
    }
    
    addComment(event?: Event): void {
        event?.preventDefault()
        
        if (this.commentText.trim().length === 0) {
            return
        }
        
        this.createCommentLoading = true
        
        const sub = this.cardService.addComment(this.commentText, this.card.id)
            .subscribe((comment) => {
                this.card.comments.push(comment)
                this.createCommentLoading = false
                this.commentText = ''
                
                if (this.currentCard) {
                    this.currentCard.commentsCount++
                }
            })
        
        this.subscriptions.push(sub)
    }
    
    getCommentAuthor(comment: CommentInterface): string {
        return comment.user.id === this.card.currentUserId ?
            comment.user.name + ' (you)' : comment.user.name
    }
    
    onMouseDown(event: MouseEvent): void {
        event.stopPropagation()
    }
    
    onDeleteCommentClick(id: number): void {
        this.showDeleteCommentConfirm = true
        this.activeCommentId = id
    }
    
    closeDeleteCommentConfirm(): void {
        this.showDeleteCommentConfirm = false
        this.activeCommentId = null
    }
    
    onCommentDelete(): void {
        if (!this.activeCommentId) {
            return
        }
        
        this.deleteCommentLoading = true
        
        const sub = this.cardService.deleteComment(this.activeCommentId).subscribe(() => {
            const idx = this.card.comments.findIndex(comment => comment.id === this.activeCommentId)
            this.card.comments.splice(idx, 1)
            this.deleteCommentLoading = false
            this.closeDeleteCommentConfirm()
            
            if (this.currentCard) {
                this.currentCard.commentsCount--
            }
        })
        
        this.subscriptions.push(sub)
    }
    
}
