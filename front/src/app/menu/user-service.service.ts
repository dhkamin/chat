import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from '../_model/user';
const httpOptions = {
  headers: new HttpHeaders({'Access-Control-Allow-Origin': '*'})
};

const headersOpt = {
 headers: new HttpHeaders({'content-type': 'application/json'}),
};
const apiUrl = '/api';
const  url  = '' ;
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    return this.http.post<any>(`${apiUrl}/login`, { username: username, password: password })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            return user;
        }),
        catchError(this.handleError));
}
logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
}
  register(user: User): Observable<any> {
    return this.http.post(`${apiUrl}/user`, user , headersOpt).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  getAll() {
    return this.http.get<User[]>(`${url}/user`, httpOptions);
}
getById(id: number) {
    return this.http.get(`${url}/users/` + id);
}
/*
register(user: User) {
    return this.http.post(`${'localhost:5000'}/users/register`, user);
}*/
update(user: User) {
    return this.http.put(`${url}/users/` + user.id, user);
}
delete(id: number) {
    return this.http.delete(`${url}/users/` + id);
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
