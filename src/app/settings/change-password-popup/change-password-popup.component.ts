import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { SettingsService } from '../shared/settings.service'

@Component({
    selector: 'app-change-password-popup',
    templateUrl: './change-password-popup.component.html',
    styleUrls: ['./change-password-popup.component.scss']
})
export class ChangePasswordPopupComponent implements OnInit, OnDestroy {
    
    @Output() onClose = new EventEmitter()
    
    form: FormGroup
    loading: boolean = false
    error: string | null = null
    subscriptions: Subscription[] = []
    
    constructor(private settingsService: SettingsService) {
    }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            currentPassword: new FormControl(null, Validators.required),
            newPassword: new FormControl(null, Validators.required)
        })
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    submit(): void {
        this.loading = true
        
        const sub = this.settingsService.changePassword(
            this.form.value.currentPassword,
            this.form.value.newPassword
        ).subscribe({
            next: () => {
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
