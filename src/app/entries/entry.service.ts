import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = 'http://localhost:8080/api/entries';

  constructor(private http: HttpClient) {}

  // CRUD Operations
  // getEntries(): Observable<Entry[]> {
  //   return this.http.get<Entry[]>(this.apiUrl);
  // }

  // getEntry(id: string): Observable<Entry> {
  //   return this.http.get<Entry>(`${this.apiUrl}/${id}`);
  // }

  // createEntry(entry: Entry): Observable<Entry> {
  //   return this.http.post<Entry>(this.apiUrl, entry);
  // }

  // updateEntry(id: string, entry: Entry): Observable<Entry> {
  //   return this.http.put<Entry>(`${this.apiUrl}/${id}`, entry);
  // }

  // deleteEntry(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}