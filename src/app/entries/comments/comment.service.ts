import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Comment } from './comment.model';

import { CharacterService } from '../../characters/character.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient, private characterService: CharacterService) {}

  // CRUD Operations
  // getCommentsByEntry(entryId: string): Observable<Comment[]> {
  //   return this.http.get<Comment[]>(`${this.apiUrl}/entry/${entryId}`);
  // }

  // createComment(comment: Partial<Comment>): Observable<Comment> {
  //   const currentCharacterId = this.characterService.getCurrentCharacterId();
  //   if (!currentCharacterId) {
  //     return throwError(() => new Error('No character selected'));
  //   }

  //   const fullComment = {
  //     ...comment,
  //     characterId: currentCharacterId
  //   };

  //   return this.http.post<Comment>(this.apiUrl, fullComment);
  // }

  // updateComment(id: string, comment: Comment): Observable<Comment> {
  //   return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment);
  // }

  // deleteComment(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}