import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BoardService } from '../../../services/board.service'
import { UserService } from '../../../services/user.service'
import { AddOrRemoveMemberInterface } from '../../../types/add-or-remove-member.interface'
import { BoardMembersInterface } from '../../../types/board-members.interface'
import { UserInterface } from '../../../types/user.interface'

@Component({
    selector: 'app-add-member-popup',
    templateUrl: './add-member-popup.component.html',
    styleUrls: ['./add-member-popup.component.scss']
})
export class AddMemberPopupComponent implements OnInit, OnDestroy {
    
    @Input() boardId: number
    @Input() boardAdminEmails: string[]
    @Input() boardMemberEmails: string[]
    @Input() boardCurrentUserEmail: string
    @Input() boardMembersData: BoardMembersInterface
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    error: string | null = null
    user: UserInterface | null = null
    userLoading: boolean = false
    addMemberLoading: boolean = false
    subscriptions: Subscription[] = []
    
    constructor(
        private boardService: BoardService,
        private userService: UserService
    ) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email])
        })
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    hasUserByEmailThisBoard(email: string): boolean {
        return (
            this.boardAdminEmails.includes(email) ||
            this.boardMemberEmails.includes(email) ||
            this.boardCurrentUserEmail === email
        )
    }
    
    findUser() {
        const email = this.form.value['email']
        
        if (this.hasUserByEmailThisBoard(email)) {
            this.error = 'User with this email already has this board'
            this.user = null
            return
        }
        
        this.userLoading = true
        
        const sub = this.userService.getUserByEmail(email).subscribe({
            next: (user) => {
                this.user = user
                this.userLoading = false
                this.error = null
            },
            error: (error) => {
                this.error = error.error.message
                this.user = null
                this.userLoading = false
            }
        })
        
        this.subscriptions.push(sub)
    }
    
    addMember() {
        if (!this.user) {
            return
        }
        
        const data: AddOrRemoveMemberInterface = {
            boardId: this.boardId,
            userId: this.user?.id
        }
        
        this.addMemberLoading = true
        
        const sub = this.boardService.addMember(data).subscribe(() => {
            if (!this.user) {
                return
            }
            
            this.addMemberLoading = false
            this.boardMembersData.members.push({ ...this.user, isAdmin: false })
            this.user = null
            this.form.reset()
            const board = this.boardService.boards.find(board => board.id === this.boardId)
            
            if (board) {
                board.membersCount++
            }
            
            this.onClose.emit()
        })
        
        this.subscriptions.push(sub)
    }
    
}
