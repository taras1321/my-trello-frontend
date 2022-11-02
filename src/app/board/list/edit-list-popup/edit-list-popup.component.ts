import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { ListInterface } from '../../../shared/types/list.interface'
import { ListService } from '../../shared/services/list.service'

@Component({
    selector: 'app-edit-list-popup',
    templateUrl: './edit-list-popup.component.html',
    styleUrls: ['./edit-list-popup.component.scss']
})
export class EditListPopupComponent implements OnInit, OnDestroy {
    
    @Input() listId: number
    @Input() listName: string
    @Input() allLists: ListInterface[]
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading: boolean = false
    subscription: Subscription
    
    constructor(private listService: ListService) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(this.listName, Validators.required)
        })
    }
    
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
    }
    
    submit(): void {
        this.loading = true
        
        this.subscription = this.listService.editList(this.listId, this.form.value.name)
            .subscribe((listData) => {
                const list = this.allLists.find(list => list.id === listData.id)
                
                if (list) {
                    list.name = listData.name
                }
                
                this.onClose.emit()
            })
    }
    
}
