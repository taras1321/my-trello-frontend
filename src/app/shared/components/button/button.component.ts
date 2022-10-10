import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    
    @Input() loading: boolean
    @Input() disabled?: boolean = false
    @Input() type?: 'summit' | 'button' = 'button'
    
}
