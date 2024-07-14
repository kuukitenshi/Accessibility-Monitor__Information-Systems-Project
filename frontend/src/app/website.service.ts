import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Website } from './website';
import { Webpage } from './webpage';
import { ReportFileType } from './report-file-type';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private apiUrl = 'http://localhost:3069/websites';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getWebsites(): Observable<Website[]> { 
    return this.http.get<Website[]>(this.apiUrl)
      .pipe(
        map(ws => ws.map(this.convertTypes)),
        catchError(this.handleError<Website[]>('getWebsites', []))
      );
  }

  getWebsite(id: string): Observable<Website> { 
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Website>(url).pipe(
      tap(w => {
        this.convertTypes(w);
      }),
      catchError(this.handleError<Website>(`getWebsite id=${id}`))
    );
  }

  addWebsite(website: Website): Observable<Website> {
    return this.http.post<Website>(this.apiUrl, website, this.httpOptions).pipe(
      tap((newWebsite: Website) => {
        this.convertTypes(newWebsite);
      }),
      catchError(this.handleError<Website>('addWebpage'))
    );
  }

  deleteWebsite(website: Website): Observable<Website> { 
    const url = `${this.apiUrl}/${website._id}`;
    return this.http.delete<Website>(url, this.httpOptions).pipe(
      tap(w => {
        this.convertTypes(w);
      }),
      catchError(this.handleError<Website>('deleteWebsite'))
    );
  }

  startEvaluation(website: Website, webpages: string[]): Observable<{website: Website, webpages: Webpage[]}> {
    const url = `${this.apiUrl}/${website._id}/evaluate`;
    return this.http.post<{website: Website, webpages: Webpage[]}>(url, {webpages: webpages}, this.httpOptions).pipe(
      tap(w => {
      }),
      catchError(this.handleError<any>('evaluateWebpages'))
    );
  }

  downloadReport(website: Website, type: ReportFileType): Observable<any> {
    const url = `${this.apiUrl}/${website._id}/report`;
    return this.http.get<any>(url, {responseType: 'blob' as 'json', headers: { 'Accept': type.toString()}}).pipe(
      catchError(this.handleError<any>('downloadReprot'))
    );
  }
    

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private convertTypes(website: Website): Website {
    website.creation_date = new Date(website.creation_date);
    if (website.last_evaluation_date)
      website.last_evaluation_date = new Date(website.last_evaluation_date);
    return website;
  }
}
