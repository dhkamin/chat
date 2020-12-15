import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import * as io from 'socket.io-client';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private url = '';
  private socket;
  constructor(private http: HttpClient) { this.socket = io(this.url); }
  public initSocket(): void {
    this.socket = socketIo(this.url);
}


  public getRooms = () => {
    return Observable.create((observer) => {
        this.socket.emit('get-rooms').on('getRooms', resp => {
          console.log(resp);
          observer.next(resp);
        });
    });
  }
  public getRoomsByID = () => {
    return Observable.create((observer) => {
        this.socket.emit('get-rooms').on('getRooms', resp => {
        //  console.log(resp);
          observer.next(resp);
        });
    });
  }

  public AddRooms(Rooms) {
   //  console.log('new-room ----------', Rooms);
    const room = {
      name: Rooms.AdresseRoom,
      password: Rooms.PasswordRoom,
      type: 2,
      size: Rooms.TailleRoom,
      message: Rooms.MessageInitRoom,
      user_id: 8
    };
     this.socket.emit('new-room', room).on('addRoom', resp => {
     // console.log(resp, '2222222222222222222222222');
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

}
