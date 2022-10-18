import { UserWithBoardStatusType } from './user-with-board-status.type'

export interface BoardMembersInterface {
    currentUser: UserWithBoardStatusType
    members: UserWithBoardStatusType[]
    boardName: string
}
