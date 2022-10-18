import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
    
    @Input() text: string
    @Input() buttonText: string
    @Input() loading: boolean = false
    @Output() onCancel = new EventEmitter()
    @Output() onConfirm = new EventEmitter()
    
    onCloseConfirm() {
        this.onCancel.emit()
    }
    
}
