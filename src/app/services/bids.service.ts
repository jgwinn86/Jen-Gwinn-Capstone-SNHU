import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BidsService {

  //URL for backend
  private apiUrl = 'http://localhost:3000/api/bids';

  constructor(private http: HttpClient) {}

  // Load all bids
  getBids(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Load a single bid by ID
  getBidById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Load filtered bids
  getFilteredBids(filters: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params: filters });
  }
}
