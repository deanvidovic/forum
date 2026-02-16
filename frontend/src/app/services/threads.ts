import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class Threads {
  private apiUrl = `${environment}/threads`;

  constructor(private http: HttpClient) {}

  getThreads(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createThread(thread: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, thread);
  }

  deleteThread(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateThread(id: number, threadData: { title: string, content: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, threadData);
  }

  toggleLike(threadId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${threadId}/like`, {});
  }

  getThreadById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addComment(commentData: { content: string, threadId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comments`, commentData);
  }
}
