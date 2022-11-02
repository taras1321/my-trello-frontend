import { BoardColorsType } from './board-colors.type'

export interface EditBoardResponseInterface {
    id: number
    name: string
    color: BoardColorsType
}