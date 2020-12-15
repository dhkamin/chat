import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Event } from '../../../_model/Event';
import * as socketIo from 'socket.io-client';
const SERVER_URL = '';
@Injectable({
  providedIn: 'root'
})
export class SocketUserService {

  constructor() { }
  private socket;

  public initSocket(): void {
      this.socket = socketIo(SERVER_URL);
  }
  public onUser(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('getUsers', (data: any) =>
          observer.next(data));
      });
  }
  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}
