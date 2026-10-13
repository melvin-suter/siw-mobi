import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  user$ = this.http.get<any>('/api/me');

  logout() {
    return this.http.post('/api/auth/logout', {});
  }
}