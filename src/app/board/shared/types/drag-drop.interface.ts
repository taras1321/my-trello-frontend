import { CdkDragDrop } from '@angular/cdk/drag-drop'

export interface DragDropInterface {
    event: CdkDragDrop<any>
    listId: number
}