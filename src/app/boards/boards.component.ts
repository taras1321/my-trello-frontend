import { Component, OnInit } from '@angular/core'
import { BoardService } from '../shared/services/board.service'

@Component({
    selector: 'app-boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
    
    boards: any[]
    loading: boolean
    
    constructor(private boardService: BoardService) {
    }
    
    ngOnInit(): void {
        this.loading = true
        
        this.boardService.getAll().subscribe((boards) => {
            this.boards = boards
            this.loading = false
        })
    }
    
}
