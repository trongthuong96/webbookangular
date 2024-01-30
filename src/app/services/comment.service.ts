import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentCreateModel } from '../models/comment/comment.create.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  private urlBase = `${environment.apiUrl}/comment`

  addComment(commentCreate: CommentCreateModel): Observable<any> {
    const url = `${this.urlBase}`;
    return this.http.post<any>(url, commentCreate);
  } 
}
