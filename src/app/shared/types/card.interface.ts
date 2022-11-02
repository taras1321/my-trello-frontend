export interface CardInterface {
    id: number
    name: string
    hasExecutor: boolean
    executorId: number | null
    commentsCount: number
    commentsCountByUser: { userId: number, commentsCount: number }[]
}