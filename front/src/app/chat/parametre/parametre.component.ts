import { Component, OnInit } from '@angular/core';
import {ParametreService} from './parametre.service';
import { from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { throttleTime } from 'rxjs/operators';
import {SocketParametreService} from './chat_socket/socket-parametre.service';
import { Event } from '../../_model/Event';


import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css']
})
export class ParametreComponent implements OnInit {
  params;
  obj_Params = { fromUser: '111111', toUser: '111111' };
  public parametrs: any[] = [];
  prms: any ;
  ioConnection: any;

  constructor(  private route: ActivatedRoute,
                private router: Router,
                private parametreService: ParametreService,
                private socket_parametre_service: SocketParametreService
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
    }, 0);
     this.parametreService.getParametre(this.obj_Params).subscribe((parametres: any[]) => {
     this.prms = parametres;
     parametres.forEach(element => {
        this.parametrs.push(element);
      });
    });
  }
  private initIoConnection(): void {
    this.socket_parametre_service.initSocket();

    this.ioConnection = this.socket_parametre_service.onParametre()
      .subscribe((parametres:  any) => {
         this.parametrs.push( this.extractData(parametres.message));
         console.log(this.parametrs);
      });


    this.socket_parametre_service.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected-----');
      });

    this.socket_parametre_service.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }
  public sendParametre(parametrs) {
    // console.log('message client ', mesage);
    const prms = {
      message : parametrs,
      fromUser : '111111',
      toUser : '111111',
      roomId : ''
      };
this.parametreService.sendParametre(prms);
}
private extractData(res: Response) {
  let body = res;
  return body || { };
}

onClick(){
  this.router.navigate(['/']);
  console.log("jfkjdfkjsdf");
  return "kjkjk"
}

}
