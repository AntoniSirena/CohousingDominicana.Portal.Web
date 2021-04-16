import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IconfigurationParameter } from '../../interfaces/IconfigurationParameter/iconfiguration-parameter';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParameterService {

  coreURL;

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }

  getConfigurationParameters(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/ConfigurationParameter');
  }

  getConfigurationParameterById(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/ConfigurationParameter/' + id);
  }

  editConfigurationParameter(configurationParameter: IconfigurationParameter) {
    let Json = JSON.stringify(configurationParameter);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put(`${this.coreURL}api/ConfigurationParameter`, Json, { headers: headers });
  }

  createConfigurationParameter(configurationParameter: IconfigurationParameter) {
    let Json = JSON.stringify(configurationParameter);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.coreURL}api/ConfigurationParameter`, Json, { headers: headers });
  }

  delete(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + 'api/ConfigurationParameter/' + id);
  }

}
