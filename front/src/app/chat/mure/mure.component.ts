import { Component, OnInit } from '@angular/core';
import {MureService} from './mure.service';
import {SocketMureService} from './socket/socket-mure.service';
import { Event } from '../../_model/Event';
@Component({
  selector: 'app-mure',
  templateUrl: './mure.component.html',
  styleUrls: ['./mure.component.css']
})
export class MureComponent implements OnInit {
  mes_priv;
  obj_Priv_Message = { fromUser: '111111', toUser: '111111' };
  public publications: any[] = [];
  pubs: any ;
  ioConnection: any;
  constructor(
                private mure_ervice: MureService,
                private socket_mure_service: SocketMureService
    ) { }
  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
    }, 0);
     this.mure_ervice.getPublication(this.obj_Priv_Message).subscribe((publication: any[]) => {
     this.pubs = publication;
     publication.forEach(element => {
        this.publications.push(element);
      });
    });
  }
  private initIoConnection(): void {
    this.socket_mure_service.initSocket();
    this.ioConnection = this.socket_mure_service.onPub()
      .subscribe((publication:  any) => {
         this.publications.push( this.extractData(publication.message));
         console.log(this.publications);
      });
    this.socket_mure_service.onEvent(Event.CONNECT)
      .subscribe(() => {
      });
    this.socket_mure_service.onEvent(Event.DISCONNECT)
      .subscribe(() => {
      });
  }
  public sendMessage(publication) {
    const pub = {
      message : publication.message,
      fromUser : '111111',
      toUser : '111111',
      roomId : ''
      };
this.mure_ervice.CreatPublication(pub);
}
private extractData(res: Response) {
  const body = res;
  return body || { };
}
}
