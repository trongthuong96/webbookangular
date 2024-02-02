export class CommentModel {
    id!: number;
    content!: string;
    bookId!: number;
    parentId: number | null = null;
    userId!: string;
    fullName!: string;
    createdAt!: Date;
    count!: number;
    avatar!: string;
}