import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FreeImageHost } from '../models/image/freeImage.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiKey = '640e7f433be1b12335a85baa19a880b9';
  private apiUrl = `https://api.imgbb.com/1/upload?key=${this.apiKey}`; 

  constructor(private http: HttpClient) { }

  uploadImage(image: File, name: string): Observable<FreeImageHost> {
    
    const formData = new FormData();

    formData.append('image', image);
    formData.append('name', name);

    return this.http.post<FreeImageHost>(this.apiUrl, formData);

  }

}