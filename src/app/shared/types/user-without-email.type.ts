import { UserInterface } from './user.interface'

export type UserWithoutEmailType = Omit<UserInterface, 'email'>