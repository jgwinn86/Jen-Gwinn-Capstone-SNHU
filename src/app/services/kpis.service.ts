import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpisService {

  // Base API URL for KPI endpoint
  private apiUrl = 'http://localhost:3000/api/kpis';

  constructor(private http: HttpClient) {}

  // Load KPI summary 
  getKpis(filters?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params: filters });
  }
}
