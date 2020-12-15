import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import * as socketIo from 'socket.io-client';
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
export class UserconnectedService {
  private url = '';

  private socket;
  constructor(private http: HttpClient) { this.socket = io(this.url); }
  public sendUsers(users) {
     const usrs = {
       message : users.message,
       fromUser : '111111',
       toUser : '111111',
       roomId : ''
       };
     this.socket.emit('chat_message', usrs);
 }
public getUsers = (users) => {
  return Observable.create((observer) => {

      this.socket.emit('message-private', users).on('messagePrivate', ( usrs: any) => {
        console.log('usrs', usrs);
        observer.next(usrs);
      });

  });
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
