import { UserInterface } from './user.interface'

export type UserWithBoardStatusType = UserInterface & { isAdmin: boolean }