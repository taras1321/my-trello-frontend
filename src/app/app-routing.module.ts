import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthComponent } from './auth/auth.component'
import { BoardComponent } from './board/board.component'
import { BoardsComponent } from './boards/boards.component'
import { BoardsLayoutComponent } from './layouts/boards-layout/boards-layout.component'
import { SettingsComponent } from './settings/settings.component'
import { AuthorizedGuard } from './shared/services/authorized.guard'
import { UnauthorizedGuard } from './shared/services/unauthorized.guard'

const routes: Routes = [
    { path: 'login', component: AuthComponent, canActivate: [UnauthorizedGuard] },
    { path: 'registration', component: AuthComponent, canActivate: [UnauthorizedGuard] },
    {
        path: '', component: BoardsLayoutComponent, canActivate: [AuthorizedGuard], children: [
            { path: '', component: BoardsComponent },
            { path: 'favorite', component: BoardsComponent },
            { path: 'settings', component: SettingsComponent }
        ]
    },
    { path: 'boards/:id', component: BoardComponent, canActivate: [AuthorizedGuard] },
    { path: '**', redirectTo: '/' }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
