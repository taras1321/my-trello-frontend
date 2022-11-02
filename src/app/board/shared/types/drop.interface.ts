import { CdkDragDrop } from '@angular/cdk/drag-drop'

export interface DropInterface {
    event: CdkDragDrop<any>
    listId: number
}