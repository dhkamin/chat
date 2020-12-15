import { Component, OnInit } from '@angular/core';
import {UserconnectedService} from './userconnected.service';
import { from } from 'rxjs';

import { Router} from '@angular/router';
import { throttleTime } from 'rxjs/operators';
import {SocketUsersService} from '../socket_users/socket-users.service';
import { Event } from '../../../_model/Event';


@Component({
  selector: 'app-userconnected',
  templateUrl: './userconnected.component.html',
  styleUrls: ['./userconnected.component.css']
})
export class UserconnectedComponent implements OnInit {
  users;
  obj_Users = { fromUser: '111111', toUser: '111111' };
  public users_: any[] = [];
  usrs: any ;
  ioConnection: any;
  constructor(
                private users_connected_service: UserconnectedService,
                private socket_users_connected_service: SocketUsersService
    ) { }
  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
    }, 0);
     this.users_connected_service.getUsers(this.obj_Users).subscribe((users: any[]) => {
     this.usrs = users;
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
  public sendUsers(users) {
    // console.log('message client ', mesage);
    const usrs = {
      message : users,
      fromUser : '111111',
      toUser : '111111',
      roomId : ''
      };
this.users_connected_service.sendUsers(usrs);
}
private extractData(res: Response) {
  let body = res;
  return body || { };
}

}
