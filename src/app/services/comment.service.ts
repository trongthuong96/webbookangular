import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentCreateModel } from '../models/comment/comment.create.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CommentTotalPage } from '../models/comment/comment.totalPage.model';

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

  //api/Comment?bookId=1&page=1&pageSize=20
  getCommentsParent(bookId: number, page: number, pageSize: number): Observable<CommentTotalPage> {
    const url = `${this.urlBase}?bookId=${bookId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<CommentTotalPage>(url);
  }

  //api/Comment/child?commentId=6&page=1&pageSize=10'
  getCommentsChild(commentId: number, page: number, pageSize: number): Observable<CommentTotalPage> {
    const url = `${this.urlBase}/child?commentId=${commentId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<CommentTotalPage>(url);
  }

  //api/Comment/13
  deleteComment(commentId: number): Observable<boolean> {
    const url = `${this.urlBase}/${commentId}`;
    return this.http.delete<boolean>(url);
  }
}
