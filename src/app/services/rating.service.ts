import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { RatingCreateModel } from '../models/rating/rating.create.model';
import { RatingModel } from '../models/rating/rating.model';
import { RatingAvgModel } from '../models/rating/rating.avg.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  private urlBase = `${environment.apiUrl}/rating`

  //api/Rating/bookId/18
  getRatingAvg(bookId: number): Observable<RatingAvgModel> {
    const url = `${this.urlBase}/bookId/${bookId}`;
    return this.http.get<RatingAvgModel>(url);
  }

  //api/Rating
  addRating(ratingCreate: RatingCreateModel): Observable<RatingModel> {
    const url = `${this.urlBase}`;
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.post<RatingModel>(url, ratingCreate, requestOptions);
  } 
}
