import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { chapterUrl } from '../config/api.config';
import { ChapterShowModel } from '../models/chapter/chapter.show.model';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

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
}
