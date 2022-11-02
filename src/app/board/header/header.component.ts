import { Component, Input } from '@angular/core'
import { popupAnimations } from '../../shared/animations/popup-animations'
import { BoardService } from '../../shared/services/board.service'
import { FullBoardInterface } from '../../shared/types/full-board.interface'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: popupAnimations
})
export class HeaderComponent {
    
    @Input() boardData: FullBoardInterface
    
    showMembersPopUp = false
    showEditBoardPopup = false
    
    constructor(private boardService: BoardService) {
    }
    
    toggleFavorite(): void {
        this.boardData.liked = !this.boardData.liked
        
        this.boardService.toggleFavorite(this.boardData.id).subscribe({
            error: () => {
                this.boardData.liked = !this.boardData.liked
            }
        })
    }
    
}
