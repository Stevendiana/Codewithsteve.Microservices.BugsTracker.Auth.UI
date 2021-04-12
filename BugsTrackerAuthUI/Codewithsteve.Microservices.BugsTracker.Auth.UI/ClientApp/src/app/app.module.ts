import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { MsalGuard, MsalInterceptor, MsalModule, MsalService, } from '@azure/msal-angular';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AppUserService } from './app-user-service';
import { RoleGuard } from './role.guard';
import { ContactadminComponent } from './contactadmin/contactadmin.component';
import { AssignBugComponent } from './bug/assign-bug/assign-bug.component';
import { environment } from '../environments/environment';
import { LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.uiClienId,
      authority: 'https://login.microsoftonline.com/' + environment.tenantId,
      redirectUri: environment.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  });
}

/**
 * MSAL Angular will automatically retrieve tokens for resources 
 * added to protectedResourceMap. For more info, visit: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
 */
// export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
//   const protectedResourceMap = new Map<string, Array<string>>();
//   protectedResourceMap.set(auth.resources.todoListApi.resourceUri, auth.resources.todoListApi.resourceScopes);

//   return {
//     interactionType: InteractionType.Redirect,
//     protectedResourceMap
//   };
// }

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
// export function MSALGuardConfigFactory(): MsalGuardConfiguration {
//   return { interactionType: InteractionType.Redirect };
// }


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
      { path: 'clients', component: ClientComponent, data: {roles: [environment.roles.Admin]}, canActivate: [MsalGuard, RoleGuard] },
      { path: 'bugs', component: BugComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact-admin', component: ContactadminComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard]},
    ]),
    MsalModule.forRoot({
      auth: {
        clientId: environment.uiClienId,
        authority: environment.authority,
        // redirectUri: 'http://localhost:4200/',
        redirectUri: environment.redirectUri,
       
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
        environment.scope,

      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['https://graph.microsoft.com/beta/', ['user.read']],
        [environment.bugApi, [environment.scope]],
      ],
      extraQueryParameters: {}
    })
  ],
  providers: [
    // OidcConfigService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: configureAuth,
    //   deps: [OidcConfigService],
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      // useClass: AuthInterceptor,
      multi: true
    },
    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: MSALInstanceFactory
    // },
    // {
    //   provide: MSAL_GUARD_CONFIG,
    //   useFactory: MSALGuardConfigFactory
    // },
    // {
    //   provide: MSAL_INTERCEPTOR_CONFIG,
    //   useFactory: MSALInterceptorConfigFactory
    // },
    MsalService, BsModalRef, AppFormService, AppService,AppUserService, RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function configureAuth(oidcConfigService: OidcConfigService) {
  return () =>
     oidcConfigService.withConfig({
            stsServer: 'https://login.microsoftonline.com/cc62c95e-bb02-4841-ae1e-9bafd6e5d6b5/v2.0',
            authWellknownEndpoint: 'https://login.microsoftonline.com/cc62c95e-bb02-4841-ae1e-9bafd6e5d6b5/v2.0',
            redirectUrl: window.location.origin,
            clientId: 'd2227ccb-22e8-4c84-8dba-52fd4654b35e',
            scope: 'openid profile offline_access email api://98328d53-55ec-4f14-8407-0ca5ff2f2d20/access_as_user',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            ignoreNonceAfterRefresh: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: false, // this needs to be true if using a common endpoint in Azure
            autoUserinfo: false,
            logLevel: LogLevel.Debug,
            customParams: {
              prompt: 'select_account', // login, consent
            },
    });
}


