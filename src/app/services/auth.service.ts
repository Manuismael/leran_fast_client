import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private apiUrl='http://localhost:3000/auth';

  Register(body:any):Observable<any>{
    return this.http.post(this.apiUrl, body)
  }

  Login(body:any):Observable<any>{
    return this.http.post(this.apiUrl+"/signIn",body)
  }
}
