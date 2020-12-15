import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  count_user_connected: string;

//localStorage.getItem('dataSource')
  constructor(private router: Router,) { }

  ngOnInit() {
    this.count_user_connected = localStorage.getItem('count_user_connected');
 
    

  }
  refrech(){
    window.location.reload();

  }
}
