import { UserWithoutEmailType } from '../../../shared/types/user-without-email.type'
import { CommentInterface } from './comment.interface'

export interface FullCardInterface {
    id: number
    name: string
    description: null | string
    executor: UserWithoutEmailType | null
    board: {
        id: number
        admins: UserWithoutEmailType[]
        members: UserWithoutEmailType[]
    },
    comments: CommentInterface[]
    isCurrentUserAdmin: boolean
    currentUserId: number
}