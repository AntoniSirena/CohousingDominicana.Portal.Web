import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ilogin } from '../../interfaces/Ilogin/ilogin';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  coreURL

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }

  authenticate(request: Ilogin) {
    let Json = JSON.stringify(request);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.coreURL + 'api/login/authenticate', Json, { headers: headers });
  }

  refreshToken(refreshToken: string) {
    let Json = JSON.stringify(refreshToken);
    return this.httpClient.post(this.coreURL + 'api/login/refreshToken', Json);
  }

  logOut(value: string) {
    let Json = JSON.stringify(value);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.coreURL + 'api/login/logOut', Json, { headers: headers });
  }

  resetPassword(request: Ilogin) {
    let Json = JSON.stringify(request);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.coreURL + 'api/login/resetPassword', Json, { headers: headers });
  }

  confirmPassword(request: Ilogin) {
    let Json = JSON.stringify(request);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.coreURL + 'api/login/updatePassword', Json, { headers: headers });
  }

}
