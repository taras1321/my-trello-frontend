import { UserWithoutEmailType } from '../../../shared/types/user-without-email.type'

export interface CommentInterface {
    id: number
    text: string
    createdDate: Date
    user: UserWithoutEmailType
}