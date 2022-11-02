import { BoardColorsType } from './board-colors.type'
import { ListInterface } from './list.interface'

export interface FullBoardInterface {
    id: number
    name: string
    color: BoardColorsType
    isCurrentUserAdmin: boolean
    liked: boolean
    lists: ListInterface[]
}