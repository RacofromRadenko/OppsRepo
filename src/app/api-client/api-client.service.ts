import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CryptoPrice {
	BTC: {
		USD: string;
		EUR: string;
	};

	ETH: {
		USD: string;
		EUR: string;
	};
}

export interface CurrencyPrice {
	rates: {
		USD: string;
	};
}

@Injectable({
	providedIn: 'root'
})
export class ApiClientService {
	cryptoCompareAPI: string = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR';
	currencyAPi: string = 'https://api.exchangeratesapi.io/latest';
	result: Observable<CryptoPrice>;
	res: Observable<CurrencyPrice>;
	constructor(private http: HttpClient) {}

	getDataFromAPI() {
		return (this.result = this.http.get<CryptoPrice>(this.cryptoCompareAPI));
	}

	getCurrencyValueEUROBase() {
		return (this.res = this.http.get<CurrencyPrice>(this.currencyAPi));
	}
}
