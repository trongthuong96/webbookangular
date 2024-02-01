import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { bookUrl } from '../config/api.config';
import { BookShowListModel } from '../models/book/book.list.model';
import BookShowModel from '../models/book/book.one.model';
import { BookTotalPageModel } from '../models/book/books.totalPage.model';
import { UriModel } from '../models/uri/uri.model';
import { CookieService } from 'ngx-cookie-service';
import { BookReadingModel } from '../models/book.reading/book.reading.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient
  ) {}

  private urlBase = `${environment.apiUrl}/${bookUrl}`;

   // book with id
  GetBookById(bookId: number): Observable<BookShowModel> {
    return this.http.get<BookShowModel>(`${this.urlBase}/${bookId}`);
  }

  // find book orderby views Book/OrderByViews/1
  GetBooksOrderByViewsAt(page: number): Observable<BookShowListModel[]> {
    return this.http.get<BookShowListModel[]>(`${this.urlBase}/orderByViews/${page}`);
  }

  // find book orderby views Book/OrderByViews/1
  GetBooksOrderByUpdatedAt(page: number): Observable<BookShowListModel[]> {
    return this.http.get<BookShowListModel[]>(`${this.urlBase}/orderByUpdatedAt/${page}`);
  }

  // book with slug
  GetBookBySlug(slug: string): Observable<BookShowModel> {
    return this.http.get<BookShowModel>(`${this.urlBase}/slug/${slug}`);
  }

  // private bookCache: Map<string, BehaviorSubject<BookShowModel>> = new Map<string, BehaviorSubject<BookShowModel>>();

  // GetBookBySlug(slug: string): Observable<BookShowModel> {
  //   if (this.bookCache.has(slug)) {
  //     return this.bookCache.get(slug)!.asObservable();
  //   } else {
  //     var bookTemp = new BookShowModel();
  //     const cacheSubject = new BehaviorSubject<BookShowModel>(bookTemp); // Hoặc giá trị mặc định khác nếu cần
  //     this.bookCache.set(slug, cacheSubject);

  //     return this.http.get<BookShowModel>(`${this.urlBase}/slug/${slug}`).pipe(
  //       tap((book) => {
  //         cacheSubject.next(book);
  //         // Update cache with data fetched from the source
  //         this.bookCache.get(slug)!.next(book);
  //       }),
  //       catchError(error => {
  //         console.error('Error fetching chapters:', error);
  //         return throwError('Something went wrong while fetching chapters.');
  //       })
  //     );
  //   }
  // }

  // private updateBookCacheFromDataSource(slug: string, book: BookShowModel): void {
  //   // Update cache with data fetched from the source for GetBookBySlug
  //   this.bookCache.get(slug)!.next(book);
  // }


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
    return this.http.get<BookShowListModel[]>(`${this.urlBase}/status/${page}`);
  }

  // Book/Author/2?page=1
  GetBookAuthor(authorId: number, page: number): Observable<BookShowListModel[]> {
    const url = `${this.urlBase}/author/${authorId}?page=${page}`;
    return this.http.get<BookShowListModel[]>(url);
  }

  // Book/User/2?page=1
  GetBookUser(userId: string, page: number): Observable<BookShowListModel[]> {
    const url = `${this.urlBase}/user/${userId}?page=${page}`;
    return this.http.get<BookShowListModel[]>(url);
  }

  //api/Crawling/book by metruyencv
  GetBookCrawlMetruyencv(uri: UriModel): Observable<BookShowModel> {
    const url = `${environment.apiUrl}/crawling/book`;
    return this.http.post<BookShowModel>(url, uri);
  }

  ////api/Crawling/book-listchap-crawl crawl trang 69shu fanqie
  GetBookAndListChapterCrawl(uri: UriModel): Observable<string> {
    const url = `${environment.apiUrl}/crawling/book-listchap-crawl`;
    return this.http.post(url, uri, { responseType: 'text' });
  }

  //api/BookReading
  GetBookReadingsByUserId(): Observable<BookReadingModel[]> {
    const url = `${environment.apiUrl}/bookReading`;
    return this.http.get<BookReadingModel[]>(url);
  }

  // delete bookreading /api/BookReading/{bookId}/{chineseBookId}
  DeleteBookReading(bookId: number, chineseBookId: number): Observable<any> {
    const url = `${environment.apiUrl}/bookReading/${bookId}/${chineseBookId}`;
    return this.http.delete<any>(url);
  }
}
