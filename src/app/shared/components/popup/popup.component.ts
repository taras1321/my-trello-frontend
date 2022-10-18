import {
    Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output
} from '@angular/core'

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {
    
    @Input() withCloseIcon: boolean = true
    @Input() maxWidth: string = '300px'
    @Output() onClose = new EventEmitter()
    
    @HostListener('window:keyup.Escape') escape() {
        this.onClosePopup()
    }
    
    ngOnInit(): void {
        document.body.style.overflow = 'hidden'
    }
    
    ngOnDestroy(): void {
        document.body.style.overflow = 'auto'
    }
    
    onClosePopup() {
        this.onClose.emit()
    }
    
    onPopupClick(event: Event): void {
        event.stopPropagation()
    }
    
}
