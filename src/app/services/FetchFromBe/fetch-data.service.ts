import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { WebsocketService } from '../WebsocketService/websocket.service';
import { environment } from '../../../../src/environments/environment';

export interface Data {
	arb_opportunities: [
		{
			TradingPair: string;
			BuyExchange: string;
			SellExchange: string;
			HighestBidPrice: string;
			LowestAskPrice: string;
			Spread: string;
			MaxVolume: string;
			Profit: string;
			Timestamp: string;
		}
	];
}

@Injectable()
export class FetchDataService {
	public dataBE: Subject<Data>;
	webSocket: WebSocket;
	constructor(wsService: WebsocketService) {
		this.dataBE = <Subject<Data>>wsService.connect(environment.URL).map((response): Data => {
			let data = response.data;
			return {
				arb_opportunities: JSON.parse(data)
			};
		});
	}
}
