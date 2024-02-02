export class CommentCreateModel {
    content!: string;
    bookId!: number;
    parentId: number | null = null;
}