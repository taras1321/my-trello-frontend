import { DragDropModule } from '@angular/cdk/drag-drop'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AuthComponent } from './auth/auth.component'
import { BoardComponent } from './board/board.component'
import { BoardsComponent } from './boards/boards.component'
import { ButtonComponent } from './shared/components/button/button.component'
import { LoaderComponent } from './shared/components/loader/loader.component'
import { AuthInterceptor } from './shared/services/auth.interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardsLayoutComponent } from './layouts/boards-layout/boards-layout.component';
import { SettingsComponent } from './settings/settings.component';
import { PopupComponent } from './shared/components/popup/popup.component';
import { ConfirmComponent } from './shared/components/confirm/confirm.component';
import { AddBoardPopupComponent } from './boards/add-board-popup/add-board-popup.component';
import { BoardMembersPopupComponent } from './shared/components/board-members-popup/board-members-popup.component';
import { MemberCardComponent } from './shared/components/board-members-popup/member-card/member-card.component';
import { AddMemberPopupComponent } from './shared/components/board-members-popup/add-member-popup/add-member-popup.component'

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        ButtonComponent,
        BoardsComponent,
        LoaderComponent,
        BoardComponent,
        BoardsLayoutComponent,
        SettingsComponent,
        PopupComponent,
        ConfirmComponent,
        AddBoardPopupComponent,
        BoardMembersPopupComponent,
        MemberCardComponent,
        AddMemberPopupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        DragDropModule,
        FormsModule
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
