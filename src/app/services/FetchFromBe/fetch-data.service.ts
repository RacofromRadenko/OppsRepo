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
			calculatedProfit: string;
			calculatedProfitInUSD: string;
		}
	];
}

@Injectable()
export class FetchDataService {
	public dataBE;
	webSocket: WebSocket;
	constructor(wsService: WebsocketService) {
		this.dataBE = wsService.connect(environment.URL).map((response) => {
			let data = response.data;
			let arb_opportunities = JSON.parse(data);
			if (Array.isArray(arb_opportunities)) {
				for (let i = 0; i < arb_opportunities.length; i++) {
					arb_opportunities[i].calculatedProfit = 0;
					arb_opportunities[i].calculatedProfitInUSD = 0;
				}
			} else {
				arb_opportunities['calculatedProfit'] = 0;
				arb_opportunities['calculatedProfitInUSD'] = 0;
			}
			return {
				arb_opportunities
			};
		});
	}
}
