import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { bookUrl } from '../config/api.config';
import { BookShowListModel } from '../models/book/book.list.model';
import BookShowModel from '../models/book/book.one.model';
import { BookTotalPageModel } from '../models/book/books.totalPage.model';
import { UriModel } from '../models/uri/uri.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient,
  ) { }

  private urlBase = `${environment.apiUrl}/${bookUrl}`;

   // book with id
  GetBookById(bookId: number): Observable<BookShowModel> {
    return this.http.get<BookShowModel>(`${this.urlBase}/${bookId}`);
  }

  // find book orderby views Book/OrderByViews/1
  GetBooksOrderByViewsAt(page: number): Observable<BookShowListModel[]> {
    return this.http.get<BookShowListModel[]>(`${this.urlBase}/orderbyviews/${page}`);
  }

  // find book orderby views Book/OrderByViews/1
  GetBooksOrderByUpdatedAt(page: number): Observable<BookShowListModel[]> {
    return this.http.get<BookShowListModel[]>(`${this.urlBase}/orderbyUpdatedAt/${page}`);
  }

  // book with slug
  GetBookBySlug(slug: string): Observable<BookShowModel> {
    return this.http.get<BookShowModel>(`${this.urlBase}/slug/${slug}`);
  }

  // find book by title and author name
  GetBookByTitle(title: string, page: number): Observable<BookTotalPageModel> {
    return this.http.get<BookTotalPageModel>(`${this.urlBase}/search?title=${title}&page=${page}`);
  }

  // searchAll?keyword=cau&status=0&genre=0&chapLength=0&page=1
  GetBookSearchAll(keyword: string, status: number[], genre: number, chapLength: number, page: number): Observable<BookTotalPageModel> {
    const url = `${this.urlBase}/searchAll?keyword=${keyword}&status=${status}&genre=${genre}&chapLength=${chapLength}&page=${page}`;
    return this.http.get<BookTotalPageModel>(url);
  }

  // Status/1
  GetBookStatus(page: number): Observable<BookShowListModel[]> {
    return this.http.get<BookShowListModel[]>(`${this.urlBase}/Status/${page}`);
  }

  // Book/Author/2?page=1
  GetBookAuthor(authorId: number, page: number): Observable<BookShowListModel[]> {
    const url = `${this.urlBase}/Author/${authorId}?page=${page}`;
    return this.http.get<BookShowListModel[]>(url);
  }

  // Book/User/2?page=1
  GetBookUser(userId: string, page: number): Observable<BookShowListModel[]> {
    const url = `${this.urlBase}/User/${userId}?page=${page}`;
    return this.http.get<BookShowListModel[]>(url);
  }

  //api/Crawling/book
  GetBookCrawlUri(uri: UriModel): Observable<BookShowModel> {
    const url = `${environment.apiUrl}/Crawling/book`;
    return this.http.post<BookShowModel>(url, uri);
  }
}
