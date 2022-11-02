import { Component, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { popupAnimations } from '../../shared/animations/popup-animations'
import { AuthService } from '../../shared/services/auth.service'

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
    animations: popupAnimations
})
export class MainLayoutComponent implements OnDestroy{
    
    showLogoutConfirm: boolean = false
    showMobileMenu: boolean = false
    
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }
    
    ngOnDestroy(): void {
        document.body.style.overflow = 'auto'
    }
    
    logout() {
        this.authService.logout()
        this.router.navigate(['/login'])
    }
    
    closeMobileMenu() {
        this.showMobileMenu = false
        document.body.style.overflow = 'auto'
    }
    
    onShowMobileMenu() {
        this.showMobileMenu = true
        document.body.style.overflow = 'hidden'
    }
    
    onLogoutClick() {
        this.showLogoutConfirm = true
    }
    
}
