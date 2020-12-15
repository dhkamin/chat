import { RoomsService } from './rooms.service';
import {SocketServiceService} from './socket-chambre/socket-service.service'
import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Event } from '../../_model/Event';

export interface DialogData {
  AdresseRoom: string;
  PsudoRoom: string;
  MessageInitRoom: string;
  PasswordRoom: string;
  TailleRoom: number;
}
@Component({
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrls: ['./chambre.component.css']
})
export class ChambreComponent implements OnInit {
  ListRooms: any ;
  AdresseRoom: string;
  PsudoRoom: string;
  public rooms: any[] = [];
  ioConnection: any;
  constructor(
              private roomsService: RoomsService,
              private socketrooms: SocketServiceService,
              public dialog: MatDialog) { }
  ngOnInit() {
    setTimeout(() => {
      this.initIoConnection();
    }, 0);
    this.roomsService
    .getRooms()
    .subscribe((rooms: string) => {
      this.ListRooms = rooms;
      console.log('ListRooms', this.ListRooms);
      });
  }

  private initIoConnection(): void {
    this.socketrooms.initSocket();

    this.ioConnection = this.socketrooms.onChambre()
      .subscribe((rooms:  any) => {
        this.ListRooms = rooms;
        console.log('000000000', this.ListRooms);
      });
    this.socketrooms.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected-----');
      });

    this.socketrooms.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }
 
  AddRoom(room) {
    console.log('ggggggggggggg',room);
    this.roomsService.AddRooms(room);
   // this.message = '';
  } 
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogaddChambr, {
      width: '310px',
      data: {AdresseRoom: this.AdresseRoom, PsudoRoom: this.PsudoRoom}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.AdresseRoom = result;
        this.AddRoom(result);
    });
  }
}
@Component({
  selector: 'app-addChambr',
  templateUrl: './addchambre/addChambr.html',
  styleUrls: ['./addchambre/addChambr.css']
})
export class DialogaddChambr {
  constructor(
    public dialogRef: MatDialogRef<DialogaddChambr>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
