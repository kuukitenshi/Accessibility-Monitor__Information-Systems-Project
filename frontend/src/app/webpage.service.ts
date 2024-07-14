import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Webpage } from './webpage';

@Injectable({
  providedIn: 'root'
})
export class WebpageService {

  private apiUrl = 'http://localhost:3069/webpages';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getWebpages(websiteId?: string): Observable<Webpage[]> {
    let url = this.apiUrl;
    if (websiteId) {
      url = `${this.apiUrl}/?website=${websiteId}`;
    }
    return this.http.get<Webpage[]>(url).pipe(
      tap(ws => {
        ws = ws.map(this.convertTypes);
      }),
      catchError(this.handleError<any>('getWebpages'))
    )
  }

  getWebpage(id: string): Observable<Webpage> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Webpage>(url).pipe(
      tap(w => {
        this.convertTypes(w);
      }),
      catchError(this.handleError<Webpage>(`getWebsite id=${id}`))
    );
  }

  addWebpage(webpage: Webpage): Observable<Webpage> {
    return this.http.post<Webpage>(this.apiUrl, webpage, this.httpOptions).pipe(
      tap(w => {
        this.convertTypes(w);
      }),
      catchError(this.handleError<Webpage>('addWebpage'))
    );
  }

  deleteWebpage(webpage: Webpage): Observable<Webpage> {
    const url = `${this.apiUrl}/${webpage._id}`;
    return this.http.delete<Webpage>(url, this.httpOptions).pipe(
      tap(w => {
        this.convertTypes(w);
      }),
      catchError(this.handleError<Webpage>('deleteWebpage'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private convertTypes(webpage: Webpage): Webpage {
    if (webpage.last_evaluation_date) {
      webpage.last_evaluation_date = new Date(webpage.last_evaluation_date);
    }
    return webpage;
  }
}
