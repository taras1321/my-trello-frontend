import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Event, NavigationStart, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../shared/services/auth.service'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    
    isLoginPage: boolean
    form: FormGroup
    loading: boolean
    backEndError: string | null = null
    userSubscription: Subscription
    
    constructor(
        private router: Router,
        private userService: AuthService
    ) {
    }
    
    ngOnInit(): void {
        this.isLoginPage = this.router.url === '/login'
        
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                this.isLoginPage = this.router.url === '/login'
            }
        })
        
        this.initForm()
    }
    
    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe()
        }
    }
    
    initForm(): void {
        if (this.isLoginPage) {
            this.form = new FormGroup({
                email: new FormControl(null, [Validators.required, Validators.email]),
                password: new FormControl(null, Validators.required)
            })
        } else {
            this.form = new FormGroup({
                name: new FormControl(null, Validators.required),
                email: new FormControl(null, [Validators.required, Validators.email]),
                password: new FormControl(null, Validators.required)
            })
        }
    }
    
    submit(): void {
        this.loading = true
        
        if (this.isLoginPage) {
            this.userSubscription = this.userService.login(this.form.value).subscribe({
                next: () => {
                    this.backEndError = null
                    this.loading = false
                    
                    this.router.navigate(['/'])
                },
                error: (error) => {
                    this.backEndError = error.error.message
                    this.loading = false
                }
            })
        } else {
            this.userSubscription = this.userService.registration(this.form.value).subscribe({
                next: () => {
                    this.backEndError = null
                    this.loading = false
                    
                    this.router.navigate(['/'])
                },
                error: (error) => {
                    this.backEndError = error.error.message
                    this.loading = false
                }
            })
        }
    }
    
}