import { GenreBookCreate } from "./genre.book.create.model";

export class BookCreateDto {
    title!: string;
    description!: string;
    coverImage!: string;
    authorName!: string;
    genreBookCreateDto!: GenreBookCreate[];
}