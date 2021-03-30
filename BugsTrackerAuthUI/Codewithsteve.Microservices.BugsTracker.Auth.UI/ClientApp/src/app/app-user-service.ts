import { Injectable } from '@angular/core';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const requestUrl = `https://graph.microsoft.com/beta/me/photo/$value`;
const url = window.URL;


@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  
  avatar = 'assets/avatar.png';
 

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





}
