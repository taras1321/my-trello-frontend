import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { popupAnimations } from '../shared/animations/popup-animations'
import { AuthService } from '../shared/services/auth.service'
import { UserInterface } from '../shared/types/user.interface'
import { SettingsService } from './shared/settings.service'

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: popupAnimations
})
export class SettingsComponent implements OnInit, OnDestroy {
    
    user: UserInterface
    userLoading: boolean = false
    subscriptions: Subscription[] = []
    showChangeNamePopup: boolean = false
    showChangeEmailPopup: boolean = false
    showChangePasswordPopup: boolean = false
    showDeleteAccountConfirm: boolean = false
    deleteAccountLoading: boolean = false
    
    constructor(
        private settingsService: SettingsService,
        private authService: AuthService,
        private router: Router
    ) {
    }
    
    ngOnInit(): void {
        this.userLoading = true
        
        const sub = this.settingsService.getUserData().subscribe((user) => {
            this.user = user
            this.userLoading = false
        })
        
        this.subscriptions.push(sub)
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe())
    }
    
    deleteAccount(): void {
        this.deleteAccountLoading = true
        
        const sub = this.settingsService.deleteAccount().subscribe(() => {
            this.authService.logout()
            this.router.navigate(['/login'])
        })
        
        this.subscriptions.push(sub)
    }
    
}
