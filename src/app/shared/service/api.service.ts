import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable({ providedIn: 'root' })
export class APIService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  fetch<T>(url: string,method: Method = 'GET',body?: unknown,params?: HttpParams ): Observable<T> {
    return this.http.request<T>(method, `${this.baseUrl}/${url}`, { body, params });
  }
}