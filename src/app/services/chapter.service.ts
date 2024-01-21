import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { chapterUrl } from '../config/api.config';
import { ChapterShowModel } from '../models/chapter/chapter.show.model';
import { DataCrawl } from '../models/crawl/data.crawl';
import { DataChapCrawl } from '../models/crawl/data.chap.crawl';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  
  private cache: Map<number, BehaviorSubject<ChapterShowModel[]>> = new Map<number, BehaviorSubject<ChapterShowModel[]>>();

  constructor(
    private http: HttpClient
  ) { }

  private urlBase = `${environment.apiUrl}/${chapterUrl}`
  // Get all chapters
  getChapters(): Observable<ChapterShowModel[]> {
    return this.http.get<ChapterShowModel[]>(`${this.urlBase}`);
  }

  // Get chapter by ID
  getChapterById(id: number): Observable<ChapterShowModel> {
    return this.http.get<ChapterShowModel>(`${this.urlBase}/${id}`);
  }

  // Get chapter by index
  getChapterByIndex(bookSlug: string, chapterIndex: number): Observable<ChapterShowModel> {
    return this.http.get<ChapterShowModel>(`${this.urlBase}/chapterIndex/${bookSlug}/${chapterIndex}`);
  }

  // Get chapter metruyencv 
  getChapterMeTruyenCV(bookSlug: string, chapterIndex: number): Observable<ChapterShowModel> {
    return this.http.get<ChapterShowModel>(`${environment.apiUrl}/Crawling/${bookSlug}/${chapterIndex}`);
  }

  // GEt chapter by bookId
  getChaptersByBookId(bookId: number): Observable<ChapterShowModel[]> {
    return this.http.get<ChapterShowModel[]>(`${this.urlBase}/list/${bookId}`);
  }

  //api/Chapter/list-chinese/6
  getChaptersByChineseBookId(chineseBookId: number): Observable<ChapterShowModel[]> {
    return this.http.get<ChapterShowModel[]>(`${this.urlBase}/list-chinese/${chineseBookId}`);
  }

  // getChaptersByChineseBookId(chineseBookId: number): Observable<ChapterShowModel[]> {
  //   const cacheSubject = this.cache.get(chineseBookId);
  //   if (cacheSubject) {
  //     // Return data from cache
  //     return cacheSubject.asObservable();
  //   } else {
  //     const newCacheSubject = new BehaviorSubject<ChapterShowModel[]>([]);
  //     this.cache.set(chineseBookId, newCacheSubject);
      
  //     return this.http.get<ChapterShowModel[]>(`${this.urlBase}/list-chinese/${chineseBookId}`).pipe(
  //       tap((chaptersFromRepository) => {
  //         newCacheSubject.next(chaptersFromRepository);
  //         // Update cache with data fetched from the source
  //         this.cache.get(chineseBookId)!.next(chaptersFromRepository);
  //       }),
  //       catchError(error => {
  //         console.error('Error fetching chapters:', error);
  //         return throwError('Something went wrong while fetching chapters.');
  //       })
  //     );
  //   }
  // }

   /// /api/Crawling/list-chap-crawl
   GetListChapCrawl(data: DataChapCrawl): Observable<any> {
    this.cache.delete(data.chineseBookId);
    const url = `${environment.apiUrl}/Crawling/list-chap-crawl`;
    return this.http.post(url, data);
  }

  // api/Crawling/chap-content-crawl
  getContentChapCrawl(data: DataCrawl): Observable<ChapterShowModel> {
    return this.http.post<ChapterShowModel>(`${environment.apiUrl}/Crawling/chap-content-crawl`, data);
  }
}
