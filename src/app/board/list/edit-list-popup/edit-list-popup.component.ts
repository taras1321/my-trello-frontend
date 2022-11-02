import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ListInterface } from '../../../shared/types/list.interface'
import { ListService } from '../../shared/services/list.service'

@Component({
    selector: 'app-edit-list-popup',
    templateUrl: './edit-list-popup.component.html',
    styleUrls: ['./edit-list-popup.component.scss']
})
export class EditListPopupComponent implements OnInit {
    
    @Input() listId: number
    @Input() listName: string
    @Input() allLists: ListInterface[]
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading: boolean = false
    
    constructor(private listService: ListService) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(this.listName, Validators.required)
        })
    }
    
    submit(): void {
        this.loading = true
        
        this.listService.editList(this.listId, this.form.value.name).subscribe((listData) => {
            const list = this.allLists.find(list => list.id === listData.id)
            
            if (list) {
                list.name = listData.name
            }
            
            this.onClose.emit()
        })
    }
    
}
