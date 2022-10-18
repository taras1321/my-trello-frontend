import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { BoardService } from '../../../services/board.service'
import { UserService } from '../../../services/user.service'
import { AddMemberInterface } from '../../../types/add-member.interface'
import { BoardMembersInterface } from '../../../types/board-members.interface'
import { UserInterface } from '../../../types/user.interface'

@Component({
    selector: 'app-add-member-popup',
    templateUrl: './add-member-popup.component.html',
    styleUrls: ['./add-member-popup.component.scss']
})
export class AddMemberPopupComponent implements OnInit {
    
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
        
        this.userService.getUserByEmail(email).subscribe({
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
    }
    
    addMember() {
        if (!this.user) {
            return
        }
        
        const data: AddMemberInterface = {
            boardId: this.boardId,
            userId: this.user?.id
        }
        
        this.addMemberLoading = true
        
        this.boardService.addMember(data).subscribe(() => {
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
        })
    }
    
}
