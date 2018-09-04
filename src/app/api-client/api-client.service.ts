import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';





export interface CryptoPrice{
  EUR: string;
  USD: string;
}

@Injectable({
  providedIn: 'root'
})



export class ApiClientService {
  url: string = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR"
  result: Observable<CryptoPrice>;
  constructor(private http:HttpClient) {

   }

   getDataFromAPI() {
     return this.result = this.http.get<CryptoPrice>(this.url);
   }
}
