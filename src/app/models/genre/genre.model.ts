import { BookShowListModel } from "../book/book.list.model";

export class GenreShowModel {
    id!: number;
    name!: string;
    description!: string;
    totalPages!: number;
    bookInGenreDtos!: BookShowListModel[];
}