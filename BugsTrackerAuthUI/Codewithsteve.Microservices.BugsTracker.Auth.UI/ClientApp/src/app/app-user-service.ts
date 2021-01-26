import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  getUserPhoto(): Observable<SafeUrl> {
    const requestUrl = `https://graph.microsoft.com/beta/me/photo/$value`;
    return this.http.get(requestUrl, { responseType: "blob" }).pipe(map(result => {
      const url = window.URL;
      return this.sanitizer.bypassSecurityTrustUrl(url.createObjectURL(result));
    }));
  }


}
