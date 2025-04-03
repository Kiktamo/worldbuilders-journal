import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Comment } from './comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(
    private http: HttpClient,
  ) { }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  getCommentCount(): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.apiUrl}/count`);
  }

  getCommentsByEntry(entryId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/entry/${entryId}`);
  }

  createComment(comment: Comment): Observable<Comment> {
    if (!comment.characterId) {
      return throwError(() => new Error('No character ID provided'));
    }

    return this.http.post<Comment>(this.apiUrl, comment);
  }

  updateComment(id: string, comment: Partial<Comment>): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment);
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}