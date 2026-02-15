import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUsersUrl = `${environment.apiUrl}/users`;
  private apiAdminUrl = `${environment.apiUrl}/admin`;
  private apiThreadsUrl = `${environment.apiUrl}/threads`;

  constructor(private http: HttpClient) {}

  adminAddUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiAdminUrl}/create`, userData);
  }

  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUsersUrl}/${id}`, data);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUsersUrl}/${id}`);
  }

  getUserThreads(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiThreadsUrl}/user/${userId}`);
  }

  getLikedThreads(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiThreadsUrl}/liked/${userId}`);
  }

  deleteThread(threadId: number) {
    return this.http.delete<any>(`${this.apiThreadsUrl}/${threadId}`);
  }

  updateThread(threadId: number, data: any) {
    return this.http.put<any>(`${this.apiThreadsUrl}/${threadId}`, data);
  }
}