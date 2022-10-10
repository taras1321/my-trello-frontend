import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AuthComponent } from './auth/auth.component'
import { BoardsComponent } from './boards/boards.component'
import { ButtonComponent } from './shared/components/button/button.component'
import { AuthInterceptor } from './shared/services/auth.interceptor.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { BoardComponent } from './board/board.component'

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        ButtonComponent,
        BoardsComponent,
        LoaderComponent,
        BoardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
