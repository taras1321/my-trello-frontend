import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { UserInterface } from '../../shared/types/user.interface'
import { SettingsService } from '../shared/settings.service'

@Component({
    selector: 'app-change-name-popup',
    templateUrl: './change-name-popup.component.html',
    styleUrls: ['./change-name-popup.component.scss']
})
export class ChangeNamePopupComponent implements OnInit, OnDestroy {
    
    @Input() user: UserInterface
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading: boolean = false
    subscription: Subscription
    
    constructor(private settingsService: SettingsService) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(null, Validators.required)
        })
    }
    
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
    }
    
    submit(): void {
        if (this.form.value.name.trim().length === 0) {
            return
        }
        
        this.loading = true
        
        this.subscription = this.settingsService.changeName(this.form.value.name)
            .subscribe(({ name }) => {
                this.user.name = name
                this.onClose.emit()
            })
    }
    
}
