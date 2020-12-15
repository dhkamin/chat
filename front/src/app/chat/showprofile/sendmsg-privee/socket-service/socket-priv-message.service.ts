import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Event } from '../../../../_model/Event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = '';
@Injectable({
  providedIn: 'root'
})
export class SocketPrivMessageService {

  constructor() { }
  private socket;
  public send(message: any): void {
    this.socket.emit('chat_message', message);
}
  public initSocket(): void {
      this.socket = socketIo(SERVER_URL);
  }



  public onMessage(): Observable<any> {
    // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')

      return new Observable<any>(observer => {
          this.socket.on('chat-message-private', (data: any) => 
       
          observer.next(data));
      });
  }


  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}
