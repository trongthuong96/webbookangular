import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { genreUrl } from '../config/api.config';
import { GenreShowModel } from '../models/genre/genre.model';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private http: HttpClient
  ) { }

  private urlBase = `${environment.apiUrl}/${genreUrl}`

  // Get all genres
  getGenres(): Observable<GenreShowModel[]> {
    return this.http.get<GenreShowModel[]>(`${this.urlBase}`);
  }

  // Get books by genre ID
  getBooksByGenreId(id: number, page: number): Observable<GenreShowModel> {
    return this.http.get<GenreShowModel>(`${this.urlBase}/${id}?page=${page}`);
  }
}
