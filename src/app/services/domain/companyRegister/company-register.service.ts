import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IcompanyRegister } from '../../../interfaces/domain/IcompanyRegister/icompany-register';


@Injectable({
  providedIn: 'root'
})
export class CompanyRegisterService {

  coreURL;

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }

  get(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/companyRegister');
  }

  getById(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/companyRegister/' + id);
  }

  create(req: IcompanyRegister) {
    let Json = JSON.stringify(req);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.coreURL}api/companyRegister`, Json, { headers: headers });
  }

  update(req: IcompanyRegister) {
    let Json = JSON.stringify(req);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put(`${this.coreURL}api/companyRegister`, Json, { headers: headers });
  }

  delete(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + 'api/companyRegister/' + id);
  }


}
