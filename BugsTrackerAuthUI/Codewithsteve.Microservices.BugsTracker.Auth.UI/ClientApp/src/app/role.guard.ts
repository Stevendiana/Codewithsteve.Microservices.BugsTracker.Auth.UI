import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private _msalService: MsalService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRoles = (this._msalService.getAccount().idToken as any).roles;
    const allowedRoles = next.data["roles"];
    const matchingRoles = userRoles.filter(x => allowedRoles.includes(x));
    return matchingRoles.length > 0;
  }

  canActivate$(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.roles;

   if (!this._msalService.getAccount().idTokenClaims.roles) {
      window.alert('Token does not have roles claim. Please ensure that your account is assigned to an app role and then sign-out and sign-in again.');
      return false;
   } else if (!this._msalService.getAccount().idTokenClaims.roles.includes(expectedRole)) {
      window.alert('You do not have access as expected role is missing. Please ensure that your account is assigned to an app role and then sign-out and sign-in again.');
      return false;
   }

    return true;
  }
}
