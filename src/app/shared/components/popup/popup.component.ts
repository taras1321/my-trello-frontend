import {
    Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core'

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {
    
    @ViewChild('popup') popupRef: ElementRef<HTMLDivElement>
    
    @Input() withCloseIcon: boolean = true
    @Input() maxWidth: string = '300px'
    @Output() onClose = new EventEmitter()
    
    @HostListener('window:keyup.Escape') escape() {
        this.closePopup()
    }
    
    ngOnInit(): void {
        document.body.style.overflow = 'hidden'
    }
    
    ngOnDestroy(): void {
        document.body.style.overflow = 'auto'
    }
    
    closePopup() {
        this.onClose.emit()
    }
    
    onOverLayCLick(event: Event): void {
        if (this.popupRef.nativeElement.contains(event.target as HTMLElement)) {
            return
        }
        
        this.closePopup()
    }
    
}
