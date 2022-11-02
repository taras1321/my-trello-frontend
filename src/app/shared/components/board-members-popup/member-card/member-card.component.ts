import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { popupAnimations } from '../../../animations/popup-animations'
import { BoardService } from '../../../services/board.service'
import { AddOrRemoveMemberInterface } from '../../../types/add-or-remove-member.interface'
import { BoardMembersInterface } from '../../../types/board-members.interface'
import { UserWithBoardStatusType } from '../../../types/user-with-board-status.type'

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.scss'],
    animations: popupAnimations
})
export class MemberCardComponent implements OnDestroy{
    
    @Input() isCurrentUserCard: boolean = false
    @Input() isCurrentUserAdmin: boolean
    @Input() member: UserWithBoardStatusType
    @Input() boardId: number
    @Input() boardMembersData: BoardMembersInterface
    @Output() onCloseMembersPopup = new EventEmitter()
    
    loading: boolean
    isDeleteLoading: boolean
    showDeleteConfirm: boolean = false
    subscriptions: Subscription[] = []
    
    constructor(private boardService: BoardService, private router: Router) {
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    makeAdmin() {
        const data: AddOrRemoveMemberInterface = {
            boardId: this.boardId,
            userId: this.member.id
        }
        
        this.loading = true
        
        const sub = this.boardService.addAdmin(data).subscribe(() => {
            const changedMember = this.boardMembersData.members
                .find(member => member.id === this.member.id)
            this.loading = false
            
            if (changedMember) {
                changedMember.isAdmin = true
            }
        })
        
        this.subscriptions.push(sub)
    }
    
    makeMember() {
        const data: AddOrRemoveMemberInterface = {
            boardId: this.boardId,
            userId: this.member.id
        }
        
        this.loading = true
        
        const sub = this.boardService.addMember(data).subscribe(() => {
            const changedMember = this.boardMembersData.members
                .find(member => member.id === this.member.id)
            this.loading = false
            
            if (changedMember) {
                changedMember.isAdmin = false
            }
        })
        
        this.subscriptions.push(sub)
    }
    
    getDeleteConfirmText(): string {
        const isAntherAdmin = this.boardMembersData.members.some(menubar => menubar.isAdmin)
        
        if (!isAntherAdmin && this.isCurrentUserCard) {
            return `You are the last admin of this board.
                If you delete yourself this board will deleted too.`
        } else if (this.isCurrentUserCard) {
            return `Are you sure want to delete yourself from this board?`
        } else {
            return `Are you sure want to delete user ${this.member.name} from this board?`
        }
    }
    
    removeMemberSubCb() {
        this.isDeleteLoading = false
        
        if (this.isCurrentUserCard) {
            this.boardService.boards = this.boardService.boards
                .filter(board => board.id !== this.boardId)
            
            if (this.boardService.boardsCount) {
                this.boardService.boardsCount--
            }
            
            this.onCloseMembersPopup.emit()
            
            if (this.router.url.includes('boards')) {
                this.router.navigate(['/'])
            }
            
            return
        } else {
            const board = this.boardService.boards.find(board => board.id = this.boardId)
            
            if (board) {
                board.membersCount--
            }
        }
        
        this.boardMembersData.members = this.boardMembersData.members
            .filter(member => member.id !== this.member.id)
    }
    
    deleteMember(): void {
        const data: AddOrRemoveMemberInterface = {
            boardId: this.boardId,
            userId: this.member.id
        }
        
        this.isDeleteLoading = true
        let sub: Subscription
        
        if (this.member.isAdmin) {
            sub = this.boardService.removeAdmin(data).subscribe(this.removeMemberSubCb.bind(this))
        } else {
            sub = this.boardService.removeMember(data).subscribe(this.removeMemberSubCb.bind(this))
        }
        
        this.subscriptions.push(sub)
    }
    
}
