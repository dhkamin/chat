import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServiceService } from './user-service.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  guestform: FormGroup;
  loading = false;
  submitted = false;
  submittedLogin = false;
  submittedguest=false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
   // private alertService: AlertService
  ) {  }


  value = 'Clear me';
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  this.loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
});
this.guestform = this.formBuilder.group({
  username: ['', Validators.required]
 
});
  }
  get f() { return this.registerForm.controls; }
  get formlogin() { return this.loginForm.controls; }
  get formguest() { return this.guestform.controls; }
  onSubmitGuest(){
    this.submittedguest = true;
        
      // stop here if form is invalid
     if (this.guestform.invalid) {
        return;
    }

    this.router.navigate(['/chat']);
  }

  onSubmit() {

      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
      this.loading = true;
      console.log('hello register', this.registerForm.value);

      this.userService.register(this.registerForm.value)
          .subscribe(
              data => {
              //    this.alertService.success('Registration successful', true);
                 this.router.navigate(['/chat']);
                  console.log('benni', data);
              },
              error => {
                 // this.alertService.error(error);
                  this.loading = false;
              });
  }
  onSubmitLogin() {

    this.submittedLogin = true;
    if (this.loginForm.invalid) {
      return;
  }
  console.log('hello login form', this.loginForm.value);

  this.loading = true;
        this.userService.login(this.formlogin.username.value, this.formlogin.password.value)
            .subscribe(
              data => {
                    this.router.navigate(['/chat']);
                    // console.log('benni auth', data);
                },
                error => {
                  this.router.navigate(['/']);
                    this.loading = false;
                });
             /*   data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });*/

  }


}
