import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Access-Control-Allow-Origin': '*'})
};
const headersOpt = {
 headers: new HttpHeaders({'content-type': 'application/json'}),
};
const apiUrl = '/api';
@Injectable({
  providedIn: 'root'
})
export class GuestService {
  constructor(private http: HttpClient) { }
  getAllGuest(): Observable<any> {
    return this.http.get(apiUrl + '/users').pipe(
      map(this.extractData));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
}
