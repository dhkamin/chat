import { Component, OnInit,Inject , Injectable } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { Router} from '@angular/router';
import { ChatService } from './chat.service';
import { throttleTime } from 'rxjs/operators';

import { Event } from '../_model/Event';
import { SocketService } from '../service/socket.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
export interface DialogData {
  datamessage: string;
  sendmsg : string;
}
@Injectable()
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string;
  public messages: any[] = [];
  msgs: any ;
  menu = '';
  mess;
  ioConnection: any;
  datamessage: string;
  sendmsg = '';
  lastPontmessage:string ; 
  scroll = 1; 

  private chatroom;
  messageArray: Array<{fromUser: string, mess: string, roomId: string, toUser: string}> = [];
  private isTyping = false;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private chatService: ChatService,
    private socketService: SocketService,
    public dialog: MatDialog) {
      this.chatService.newMessageReceived().subscribe((data: any[]) => {
        this.msgs = data;
        this.isTyping = false;
      });
      

     }
  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
      this.onClicktttt();
    }, 0);
    this.chatService.getMessages().subscribe((message: any[]) => {
     this.msgs = message;
      message.forEach(element => {
        this.messages.push(element);
        this.onClicktttt();
      });
    });
    this.onClicktttt();
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
}

      onClicktttt(){
      console.log(this.document.getElementById("lastscroll"));
      this.document.getElementById("lastscroll").scrollIntoView(false);
    }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message:  any) => {
         this.messages.push( this.extractData(message.message));
          
         console.log(this.messages);
      
       this.onClicktttt();
       
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected-----');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }
  sendMessage(p) {
    this.chatService.sendMessage(p);
    console.log(p);
    this.mess = '';
    this.onClicktttt();
  }
  open(a){
    if (a === "parametre")
     this.menu = "parametre";
    if (a=== "mure")
    this.menu= "mure";
    if(a==="chambre")
      this.menu = "chambre"
    if(a ==="privateMsg")
    {
      this.menu = "privateMsg";
    }
    if(a ==="usersConnected")
    {
      this.menu = "usersConnected";
    }
  }
  onClose() {
    this.menu = '';
  }

  openDialog(p): void {

   
    const dialogRef = this.dialog.open(DialogshowProfile, {
      width: '340px',
      data: {datamessage: p.message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if( result!){
            if( result.sendmsg === "sendMsgprive")
              {
                console.log(result.sendmsg);
                this.sendmsg=result.sendmsg
              }else{
                this.datamessage = result;
              }

      }
    });
  }

  closeSendmsgprive(){
    this.sendmsg = '';
  }

}
@Component({
  selector: 'app-showProfile',
  templateUrl: './showprofile/showProfile.html',
  styleUrls: ['./showprofile/showProfile.css']
})
export class DialogshowProfile {
  sendmsg = '';
 
  constructor(
    public dialogRef: MatDialogRef<DialogshowProfile>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
openMsgprivee() {

  this.dialogRef.close( {
    sendmsg: "sendMsgprive" 
  });
  console.log("sendMsgprive");
}

}



