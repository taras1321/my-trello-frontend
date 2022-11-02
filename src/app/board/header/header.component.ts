import { Component, Input, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { popupAnimations } from '../../shared/animations/popup-animations'
import { BoardService } from '../../shared/services/board.service'
import { FullBoardInterface } from '../../shared/types/full-board.interface'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: popupAnimations
})
export class HeaderComponent implements OnDestroy{
    
    @Input() boardData: FullBoardInterface
    
    showMembersPopUp = false
    showEditBoardPopup = false
    subscriptions: Subscription[] = []
    
    constructor(private boardService: BoardService) {
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    toggleFavorite(): void {
        this.boardData.liked = !this.boardData.liked
        
        const sub = this.boardService.toggleFavorite(this.boardData.id).subscribe({
            error: () => {
                this.boardData.liked = !this.boardData.liked
            }
        })
        
        this.subscriptions.push(sub)
    }
    
}
