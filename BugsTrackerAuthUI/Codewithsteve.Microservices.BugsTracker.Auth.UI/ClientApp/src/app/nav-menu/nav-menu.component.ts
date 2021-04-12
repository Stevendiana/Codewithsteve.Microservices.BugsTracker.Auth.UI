import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { CryptoUtils, Logger } from 'msal';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppUserService } from '../app-user-service';
import { SafeUrl } from '@angular/platform-browser';
import { AuthError, InteractionRequiredAuthError } from 'msal';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  isExpanded = false;
  subscriptions: Subscription[] = [];
  isIframe = false;
  loggedIn = false;
  profile;

  name: string;
  roles: string;
  username: string;
  photo: SafeUrl;
  

  constructor(private broadcastService: BroadcastService, 
    private authService: MsalService,private _graphService: AppUserService,
    private router: Router, private http: HttpClient) { }

  ngOnInit() {

    this.authenticate();
    this.updateProfile();


  }

  authenticate() {

    let loginSuccessSubscription: Subscription;
    let loginFailureSubscription: Subscription;

    this.isIframe = window !== window.parent && !window.opener;

    this.checkAccount();

    loginSuccessSubscription = this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.updateProfile();
      this.checkAccount();

    });

    loginFailureSubscription = this.broadcastService.subscribe('msal:loginFailure', (error) => {
      console.log('Login Fails:', error);
    });

    this.subscriptions.push(loginSuccessSubscription);
    this.subscriptions.push(loginFailureSubscription);

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));


  }

  updateProfile() {

    const account = this.authService.getAccount();
    if (account!=null||account!=undefined) {

      this.name = account.name;
      this.username = account.userName;
      this.roles = account.idToken.roles;
  
      console.log(this.roles);
      console.log(this.isAdmin);
  
      this._graphService.getUserPhoto().subscribe(photo => this.photo = photo);
      this._graphService.getProfile()
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          console.log( this.profile);
        },
        error: (err: AuthError) => {
          // If there is an interaction required error,
          // call one of the interactive methods and then make the request again.
          if (InteractionRequiredAuthError.isInteractionRequiredError(err.errorCode)) {
            this.authService.acquireTokenPopup({
              scopes: this.authService.getScopesForEndpoint(GRAPH_ENDPOINT)
            })
            .then(() => {
              this.http.get(GRAPH_ENDPOINT)
                .toPromise()
                .then(profile => {
                  this.profile = profile;
                  console.log( this.profile);
                });
            });
          }
        }
      });
      
    }
   
    
  }

  login() {
    this._graphService.login();
  }

  logout() {
    this._graphService.logout();
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }


  get isAdmin(): boolean { if(this.roles!=undefined&&this.roles.length>0) {return this.roles.includes('Admin')}};

 
 
}
