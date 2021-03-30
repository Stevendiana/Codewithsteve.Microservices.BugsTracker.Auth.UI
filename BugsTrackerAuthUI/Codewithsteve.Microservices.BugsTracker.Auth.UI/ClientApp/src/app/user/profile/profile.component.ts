import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { MsalService } from "@azure/msal-angular";
import { AppUserService } from "src/app/app-user-service";

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit { 

  name: string;
  roles: string;
  username: string;
  photo: SafeUrl;
  profile;

  constructor(private _msalService: MsalService, private _graphService: AppUserService, private http: HttpClient) { }

  ngOnInit(): void {
    const account = this._msalService.getAccount();
    if (account!=null||account!=undefined) {
      this.name = account.name;
      this.username = account.userName;
      this.roles = account.idToken.roles;
      this._graphService.getUserPhoto().subscribe(photo => this.photo = photo);
      this._graphService.getProfile().subscribe(profile => this.profile = profile);
    }
   
  }

  // getProfile() {
    // this.http.get(GRAPH_ENDPOINT)
    //   .toPromise().then(profile => {
    //     this.profile = profile;
    //   });
  // }
}
