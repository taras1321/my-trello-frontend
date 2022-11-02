import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    
    @Input() loading: boolean
    @Input() disabled?: boolean = false
    @Input() type?: 'summit' | 'button' = 'button'
    @Input() color: 'blue' | 'red' | 'gray'
    @Input() size: 'big' | 'medium' | 'small' = 'big'
    @Output() onClick = new EventEmitter()
    
}
