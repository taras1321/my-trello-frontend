import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { BoardService } from '../../shared/services/board.service'
import { BoardColorsType } from '../../shared/types/board-colors.type'
import { CreateBoardInterface } from '../../shared/types/create-board.interface'

@Component({
    selector: 'app-add-board-popup',
    templateUrl: './add-board-popup.component.html',
    styleUrls: ['./add-board-popup.component.scss']
})
export class AddBoardPopupComponent implements OnInit {
    
    @Output() onClose = new EventEmitter()
    form: FormGroup
    loading: boolean = false
    color: BoardColorsType = 'blue'
    
    constructor(private boardService: BoardService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            boardName: new FormControl(null, Validators.required)
        })
    }
    
    submit(): void {
        const newBoard: CreateBoardInterface = {
            name: this.form.value['boardName'],
            color: this.color
        }
        
        this.loading = true
        
        this.boardService.createBoard(newBoard).subscribe(({ id }) => {
            this.router.navigate(['boards', id])
        })
    }
    
}
