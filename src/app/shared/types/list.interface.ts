import { CardInterface } from './card.interface'

export interface ListInterface {
    id: number
    name: string
    cards: CardInterface[]
}