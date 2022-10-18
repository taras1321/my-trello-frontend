import { animate, style, transition, trigger } from '@angular/animations'

export const popupAnimations = [
    trigger('popup', [
        transition('void => *', [
            style({ opacity: 0 }),
            animate('150ms ease-out')
        ]),
        transition('* => void', [
            style({ opacity: 1 }),
            animate('150ms ease-out', style({ opacity: 0 }))
        ])
    ])
]