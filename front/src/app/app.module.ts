import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { GuestComponent } from './guest/guest.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserServiceService } from './menu/user-service.service';
import { ChatComponent, DialogshowProfile } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import {GuestService} from './guest/guest.service';
import { ChatService } from './chat/chat.service';
import { ChambreComponent, DialogaddChambr } from './chat/chambre/chambre.component';
import { MureComponent } from './chat/mure/mure.component';
import { ParametreComponent } from './chat/parametre/parametre.component';
import { RoomsService } from './chat/chambre/rooms.service';
import {SocketService} from './service/socket.service';
import { from } from 'rxjs';
import { PrivatemsgComponent } from './chat/privatemsg/privatemsg.component';
import { SendmsgPriveeComponent } from './chat/showprofile/sendmsg-privee/sendmsg-privee.component';
import { MatFormFieldModule } from '@angular/material';
import { ChatPrivateService } from './chat/showprofile/sendmsg-privee/chat-private.service';
import {SocketPrivMessageService} from './chat/showprofile/sendmsg-privee/socket-service/socket-priv-message.service';
import { UserconnectedComponent } from './chat/users/userconnected/userconnected.component';
import {SocketMureService} from './chat/mure/socket/socket-mure.service';
import {MureService} from './chat/mure/mure.service';
import {ParametreService} from './chat/parametre/parametre.service';
import {SocketParametreService} from './chat/parametre/chat_socket/socket-parametre.service';
import {SocketUsersService} from './chat/users/socket_users/socket-users.service';
import {UserconnectedService} from './chat/users/userconnected/userconnected.service';
import { ContactemeComponent } from './contacteme/contacteme.component';
import { DroitUserComponent } from './droit-user/droit-user.component';
import { ApplicationStoreComponent } from './application-store/application-store.component';
import { YourSelfComponent } from './your-self/your-self.component';
import { AbonneComponent } from './abonne/abonne.component';
import { MyGirlsComponent } from './my-girls/my-girls.component';
import {SocketUserService} from './chat/privatemsg/socket_user/socket-user.service';
import {UserSochServService} from './chat/privatemsg/user-soch-serv.service';
import {SocketServiceService} from './chat/chambre/socket-chambre/socket-service.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    GuestComponent,
    HomeComponent,
    ChatComponent,
    ChambreComponent,
    MureComponent,
    ParametreComponent,
    PrivatemsgComponent,
    DialogaddChambr,
    DialogshowProfile,
    SendmsgPriveeComponent,
    UserconnectedComponent,
    ContactemeComponent,
    DroitUserComponent,
    ApplicationStoreComponent,
    YourSelfComponent,
    AbonneComponent,
    MyGirlsComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule, 
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    MatFormFieldModule

  ],
  entryComponents: [ChambreComponent, DialogaddChambr, DialogshowProfile, ChatComponent],

  providers: [
               ReactiveFormsModule,
               UserServiceService,
               GuestService,
               ChatService ,
               SocketService,
               ChatPrivateService ,
               SocketPrivMessageService,
               SocketMureService,
               MureService,
               ParametreService,
               SocketParametreService,
               SocketUsersService,
               UserconnectedService,
               SocketUserService,
               UserSochServService,
               SocketServiceService
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
