import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot
} from '@angular/router'

@Injectable({ providedIn: 'root' })
export class AuthorizedGuard implements CanActivate, CanActivateChild {
    
    constructor(private router: Router) {
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = localStorage.getItem('token')
        
        if (token) {
            return true
        }
        
        this.router.navigate(['/login'])
        return false
    }
    
    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.canActivate(childRoute, state)
    }
    
}
