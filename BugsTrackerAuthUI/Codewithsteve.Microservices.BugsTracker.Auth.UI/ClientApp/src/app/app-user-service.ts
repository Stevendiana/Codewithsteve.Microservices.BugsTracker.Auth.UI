import { Injectable } from '@angular/core';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { HttpParamsOptions } from './httpParamsOptions';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const requestUrl = `https://graph.microsoft.com/beta/me/photo/$value`;
const url = window.URL;


@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  private accessToken: any; 
  avatar = 'assets/avatar.png';
  httpOptions = {  
    headers: new HttpHeaders({  
        'Content-Type': 'application/json'  
    })  
  }; 
 

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, 
  private authService: MsalService) { }

  getUserPhoto(): Observable<SafeUrl> {
    return this.http.get(requestUrl, { responseType: "blob" }).pipe(map(result => {
      console.log(result);
      return this.sanitizer.bypassSecurityTrustUrl(url.createObjectURL(result));
    }));
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }
  }

  logout() {
    this.authService.logout();
  }

  getProfile(): Observable<any> {
    return this.http.get(GRAPH_ENDPOINT).pipe(map(profile => profile));
   
  }

  getToken() {

    const requestObj = {
      scopes: ["user.read"]
    };
    this.authService.acquireTokenSilent(requestObj).then(function (tokenResponse) {
      
      // Callback code here
      console.log(tokenResponse.accessToken);

      localStorage.removeItem('token');
      localStorage.setItem('token',tokenResponse.accessToken);

      // this.tokenHttpClientHeader;

      }).catch(function (error) { console.log(error);

    });

  }

  get tokenHttpClientHeader() {

    this.getToken();
    if (localStorage.getItem('token')!=null) {
      const header = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json; charset=utf-8'});
      return ({headers: header});
    }
    
  }

  tokenHttpClientHeaderWithQuery(query) {
    this.getToken();
    const httpParams: HttpParamsOptions = { fromObject: query } as HttpParamsOptions;

    const header = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json; charset=utf-8'});

    const options = { params: new HttpParams(httpParams), headers: header };
   
    return (options);
  }


  


}
