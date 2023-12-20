import { AuthorShow } from "../author/author.show";
import { ChapterShowModel } from "../chapter/chapter.show.model";
import { GenreShowModel } from "../genre/genre.model";
import { UserShowModel } from "../user/user.show.model";

export default class BookShowModel {
    id!: number;
    title!: string;
    slug!: string;
    status!: number;
    views!: number;
    description!: string;
    coverImage!: string;
    createdAt!: Date;
    updatedAt!: Date;
    genres!: GenreShowModel[];
    author!: AuthorShow;
    chapters!: ChapterShowModel[];
    applicationUser!: UserShowModel;
}