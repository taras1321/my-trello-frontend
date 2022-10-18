import { BoardColorsType } from './board-colors.type'

export interface BoardInterface {
    id: number
    name: string
    color: BoardColorsType
    membersCount: number
    liked: boolean
}