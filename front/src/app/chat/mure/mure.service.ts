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
@Injectable({
  providedIn: 'root'
})
export class MureService {
  private url = '';
  private socket;
  constructor(private http: HttpClient) { this.socket = io(this.url); }
  public CreatPublication(publication) {
     const pub = {
       message : publication.message,
       fromUser : '111111',
       toUser : '111111',
       roomId : ''
       };
     this.socket.emit('upload-photo-video-message', pub);
 }
public getPublication = (publication) => {
  return Observable.create((observer) => {

      this.socket.emit('upload-photo-video-message', publication).on('upload-file-message', ( pub: any) => {
        console.log('priv', pub);
        observer.next(pub);
      });

  });
}
public deletePublication = (publication) => {
  return Observable.create((observer) => {

      this.socket.emit('upload-photo-video-message', publication).on('upload-file-message', ( pub: any) => {
        console.log('priv', pub);
        observer.next(pub);
      });

  });
}

 private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError('Something bad happened; please try again later.');
}
private extractData(res: Response) {
  const body = res;
  return body || { };
}
}
