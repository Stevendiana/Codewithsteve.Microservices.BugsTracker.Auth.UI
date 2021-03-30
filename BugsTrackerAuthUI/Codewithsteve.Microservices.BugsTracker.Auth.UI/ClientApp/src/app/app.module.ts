import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ClientComponent } from './client/client.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { BugComponent } from './bug/bug.component';
import { EditBugComponent } from './bug/edit-bug/edit-bug.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppFormService } from './app-form-service';
import { AppService } from './app.service';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MsalGuard, MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AppUserService } from './app-user-service';
import { RoleGuard } from './role.guard';
import { ContactadminComponent } from './contactadmin/contactadmin.component';
import { AssignBugComponent } from './bug/assign-bug/assign-bug.component';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    BugComponent,
    ClientComponent,
    EditClientComponent,
    EditBugComponent,
    ProfileComponent,
    AboutComponent,
    ContactadminComponent,
    AssignBugComponent,
  ],
  entryComponents: [EditBugComponent,EditClientComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent},
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'clients', component: ClientComponent, data: {roles: ['Admin']}, canActivate: [MsalGuard, RoleGuard] },
      { path: 'bugs', component: BugComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact-admin', component: ContactadminComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard]},
    ]),
    MsalModule.forRoot({
      auth: {
        clientId: 'd2227ccb-22e8-4c84-8dba-52fd4654b35e',
        authority: 'https://login.microsoftonline.com/cc62c95e-bb02-4841-ae1e-9bafd6e5d6b5',
        // redirectUri: 'http://localhost:4200/',
        redirectUri: ' https://codewithstevemicroservicesbugstrackerauth.azurewebsites.net/',
       
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    },
    {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
        'email',

      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['https://graph.microsoft.com/beta/', ['user.read']],
        [environment.bugApi + 'bugs/', environment.scope],
        [environment.bugApi + 'clients/', environment.scope],
      ],
      extraQueryParameters: {}
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService, BsModalRef, AppFormService, AppService,AppUserService, RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



