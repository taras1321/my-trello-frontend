import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { UserInterface } from '../../shared/types/user.interface'
import { SettingsService } from '../shared/settings.service'

@Component({
    selector: 'app-change-email-popup',
    templateUrl: './change-email-popup.component.html',
    styleUrls: ['./change-email-popup.component.scss']
})
export class ChangeEmailPopupComponent implements OnInit, OnDestroy {
    
    @Input() user: UserInterface
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading: boolean = false
    error: string | null = null
    subscriptions: Subscription[] = []
    
    constructor(private settingsService: SettingsService) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email])
        })
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    submit(): void {
        this.loading = true
        
        const sub = this.settingsService.changeEmail(this.form.value.email).subscribe({
            next: ({ email }) => {
                this.user.email = email
                this.onClose.emit()
            },
            error: (error) => {
                this.error = error.error.message
                this.loading = false
            }
        })
        
        this.subscriptions.push(sub)
    }
    
}
