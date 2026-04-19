import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* Backend fund model */
export interface Fund {
  id: number;
  name: string;
  fundType: string;
}

@Injectable({
  providedIn: 'root'
})
export class FundsService {

  private apiUrl = 'http://127.0.0.1:3000/api/funds';

  constructor(private http: HttpClient) {}

  /* Retrieve funds for the selected role */
  getFunds(role: string): Observable<Fund[]> {
    return this.http.get<Fund[]>(`${this.apiUrl}?role=${role}`);
  }
}
