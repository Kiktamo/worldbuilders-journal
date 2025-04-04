import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = 'http://localhost:8080/api/uploads';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post<{ imageUrl: string }>(this.apiUrl, formData);
  }

  deleteImage(imageUrl: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl, {
      body: { imageUrl }
    });
  }
}