import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPersonType } from '../../interfaces/IpersonType/iperson-type';


@Injectable({
  providedIn: 'root'
})
export class PersonTypeService {

  coreURL;

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }

  getPersonTypes(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/personType');
  }

  getPersonTypeId(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/personType/' + id);
  }

  createPersonType(personType: IPersonType) {
    let Json = JSON.stringify(personType);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.coreURL}api/personType`, Json, { headers: headers });
  }

  editPersonType(personType: IPersonType) {
    let Json = JSON.stringify(personType);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put(`${this.coreURL}api/personType`, Json, { headers: headers });
  }

  delete(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + 'api/personType/' + id);
  }


}
