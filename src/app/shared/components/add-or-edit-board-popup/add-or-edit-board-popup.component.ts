import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { popupAnimations } from '../../animations/popup-animations'
import { BoardService } from '../../services/board.service'
import { BoardColorsType } from '../../types/board-colors.type'
import { CreateOrEditBoardInterface } from '../../types/create-or-edit-board.interface'
import { FullBoardInterface } from '../../types/full-board.interface'

@Component({
    selector: 'app-add-or-edit-board-popup',
    templateUrl: './add-or-edit-board-popup.component.html',
    styleUrls: ['./add-or-edit-board-popup.component.scss'],
    animations: popupAnimations
})
export class AddOrEditBoardPopupComponent implements OnInit {
    
    @Input() isEditBoard: boolean = false
    @Input() editBoardData: FullBoardInterface
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading: boolean = false
    deleteBoardLoading: boolean = false
    showDeleteConfirm: boolean = false
    color: BoardColorsType
    
    constructor(private boardService: BoardService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.color = this.isEditBoard ? this.editBoardData.color ?? 'blue' : 'blue'
        
        this.form = new FormGroup({
            boardName: new FormControl(
                this.isEditBoard ? this.editBoardData.name : null,
                Validators.required
            )
        })
    }
    
    submit(): void {
        const boardData: CreateOrEditBoardInterface = {
            name: this.form.value['boardName'],
            color: this.color
        }
        
        this.loading = true
        
        if (this.isEditBoard) {
            this.boardService.editBoard(boardData, this.editBoardData.id).subscribe((boardData) => {
                this.editBoardData.name = boardData.name
                this.editBoardData.color = boardData.color
                this.onClose.emit()
            })
        } else {
            this.boardService.createBoard(boardData).subscribe(({ id }) => {
                this.router.navigate(['boards', id])
            })
        }
    }
    
    deleteBoard() {
        this.deleteBoardLoading = true
        
        this.boardService.deleteBoard(this.editBoardData.id).subscribe(() => {
            this.router.navigate(['/'])
        })
    }
    
}
