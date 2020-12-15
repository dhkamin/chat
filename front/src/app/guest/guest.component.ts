import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { GuestService } from './guest.service';
@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  guests: any = [];
  constructor(
    private router: Router,
    private guestService: GuestService,

  ) { }
  ngOnInit() {
    this.getAllGuest();
  }
  getAllGuest() {
    this.guests = [];
    this.guestService.getAllGuest().subscribe((data: {}) => {
      console.log(data);
      this.guests = data;
      console.log(this.guests.length, '+++++++++++++++++' );
      localStorage.setItem('count_user_connected', this.guests.length);

    });
  }
}

