import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Request} from '../model/request';
import {Observable} from 'rxjs';
import {Api} from '../model/api.enum';

@Injectable({
  providedIn: 'root'
})
export class $httpService {

  constructor(private httpClient: HttpClient) {
  }

  public get(request: Request): Observable<any> {
    return this.httpClient.get<any>(
      Api.serverURL + request.url);
  }

  public put(request: Request): Observable<any> {
    return this.httpClient.put(
      Api.serverURL + request.url,
      request.content);
  }
}
