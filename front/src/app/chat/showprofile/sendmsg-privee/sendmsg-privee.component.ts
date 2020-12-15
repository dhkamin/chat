import { Component, OnInit } from '@angular/core';
import {ChatPrivateService} from './chat-private.service';
import { from } from 'rxjs';

import { Router} from '@angular/router';
import { throttleTime } from 'rxjs/operators';
import {SocketPrivMessageService} from './socket-service/socket-priv-message.service';
import { Event } from '../../../_model/Event';


import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-sendmsg-privee',
  templateUrl: './sendmsg-privee.component.html',
  styleUrls: ['./sendmsg-privee.component.css']
})
export class SendmsgPriveeComponent implements OnInit {
  mes_priv;
  obj_Priv_Message = { fromUser: '111111', toUser: '111111' };
  public messages: any[] = [];
  msgs: any ;
  ioConnection: any;

  constructor(
                private PrivChatService: ChatPrivateService,
                private socket_priv_message_service: SocketPrivMessageService
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
    }, 0);
     this.PrivChatService.getMessage(this.obj_Priv_Message).subscribe((message: any[]) => {
     this.msgs = message;
      message.forEach(element => {
        this.messages.push(element);
      });
    });
  }
  private initIoConnection(): void {
    this.socket_priv_message_service.initSocket();

    this.ioConnection = this.socket_priv_message_service.onMessage()
      .subscribe((message:  any) => {
         this.messages.push( this.extractData(message.message));
         console.log(this.messages);
      });


    this.socket_priv_message_service.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected-----');
      });

    this.socket_priv_message_service.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }
  public sendMessage(mesage) {
    // console.log('message client ', mesage);
    const mes = {
      message : mesage,
      fromUser : '111111',
      toUser : '111111',
      roomId : ''
      };
this.PrivChatService.sendMessage(mes);
}
private extractData(res: Response) {
  let body = res;
  return body || { };
}
}
