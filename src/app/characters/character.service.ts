import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Character } from './character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = 'http://localhost:8080/api/characters';
  private currentCharacterId: string | null = null;

  constructor(private http: HttpClient) {
    // Initialize from localStorage
    this.currentCharacterId = localStorage.getItem('currentCharacterId');
  }

  // CRUD Operations
  // getCharacters(): Observable<Character[]> {
  //   return this.http.get<Character[]>(this.apiUrl);
  // }

  // getCharacter(id: string): Observable<Character> {
  //   return this.http.get<Character>(`${this.apiUrl}/${id}`);
  // }

  // createCharacter(character: Character): Observable<Character> {
  //   return this.http.post<Character>(this.apiUrl, character);
  // }

  // updateCharacter(id: string, character: Character): Observable<Character> {
  //   return this.http.put<Character>(`${this.apiUrl}/${id}`, character);
  // }

  // deleteCharacter(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }

  // // Current character management
  // setCurrentCharacter(characterId: string): void {
  //   this.currentCharacterId = characterId;
  //   localStorage.setItem('currentCharacterId', characterId);
  // }

  // getCurrentCharacterId(): string | null {
  //   return this.currentCharacterId;
  // }

  // clearCurrentCharacter(): void {
  //   this.currentCharacterId = null;
  //   localStorage.removeItem('currentCharacterId');
  // }
}