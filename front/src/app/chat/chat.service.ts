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
const apiUrl ='/api';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = '';

  private socket;
  constructor(private http: HttpClient) { this.socket = io(this.url); }


public onMessage(): Observable<any> {
  return new Observable<any>(observer => {
      this.socket.on('message', (data: any ) => observer.next(data));
  });
}
  getAllMsgs(): Observable<any> {
    return this.http.get(apiUrl + '/messages').pipe(
      map(this.extractData));
  }
  public sendMessage(mesage) {
   // console.log('message client ', mesage);
    const mes ={
      message : mesage,
      fromUser : '111111',
      toUser : '',
      roomId : '1111'
      };
    this.socket.emit('chat_message-public', mes);
}

public getMessages = () => {
  return Observable.create((observer) => {

      this.socket.emit('message-public', '1111').on('messagePublic', ( msg: any) => {
     //   console.log(msg);
        observer.next(msg);
      });

  });
}



newMessageReceived() {
  const observable = new Observable<any>(observer => {
    this.socket.on('message-public', (msg : any) => {
   //   console.log(msg);
      observer.next(msg);
    });
    return () => {
      this.socket.disconnect();
    };
  });
  return observable;
}


typing(data) {
  this.socket.emit('typing', data);}
  joinRoom(data) {
    console.log(data);
    this.socket.emit('join', data);
  }
  receivedTyping() {
    const observable = new Observable<{ isTyping: boolean}>(observer => {
      this.socket.on('typing', (data : any ) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
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
