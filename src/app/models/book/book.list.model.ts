import { ChapterLast } from "../chapter/chapter.last.model";
import { GenreShowModel } from "../genre/genre.model";

export class BookShowListModel {
    id!: number;
    title!: string;
    slug!: string;
    status!: number;
    description!: string;
    coverImage!: string;
    createdAt!: Date;
    updatedAt!: Date;
    views!: number;
    applicationUserUserName!: string;
    genres!: GenreShowModel[];
    authorName!: string;
    chapterLast!: ChapterLast;
}