import { Component, EventEmitter, Output } from '@angular/core'

@Component({
    selector: 'app-list-menu',
    templateUrl: './list-menu.component.html',
    styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent {
    
    @Output() showDeleteListConfirm = new EventEmitter()
    @Output() showEditListPopup = new EventEmitter()
    
}
