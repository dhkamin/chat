import { Component, OnInit } from '@angular/core';
import {UserSochServService} from './user-soch-serv.service';
import { from } from 'rxjs';

import { Router} from '@angular/router';
import { throttleTime } from 'rxjs/operators';
import {SocketUserService} from './socket_user/socket-user.service';
import { Event } from '../../_model/Event';

@Component({
  selector: 'app-privatemsg',
  templateUrl: './privatemsg.component.html',
  styleUrls: ['./privatemsg.component.css']
})
export class PrivatemsgComponent implements OnInit {

  users;
  obj_Users = { fromUser: '111111', toUser: '111111' };
  public users_: any[] = [];
  usrs: any ;
  ioConnection: any;
  constructor(
                private users_connected_service: UserSochServService,
                private socket_users_connected_service: SocketUserService
    ) { }
  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
    }, 0);
     this.users_connected_service.getUsers(this.obj_Users).subscribe((users: any[]) => {
     this.usrs = users;
     console.log('hhhhhhhhhhhhhh', this.usrs);
     users.forEach(element => {
        this.users_.push(element);
      });
    });
  }
  private initIoConnection(): void {
    this.socket_users_connected_service.initSocket();

    this.ioConnection = this.socket_users_connected_service.onUser()
      .subscribe((users:  any) => {
         this.users_.push( this.extractData(users.message));
         console.log(this.users_);
      });
    this.socket_users_connected_service.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected-----');
      });

    this.socket_users_connected_service.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

private extractData(res: Response) {
  let body = res;
  return body || { };
}

}
