import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebsocketService {
	today = new Date();
	yesterday = new Date();

	constructor() {}
	private subject: Rx.Subject<MessageEvent>;

	public connect(url: string): Rx.Subject<MessageEvent> {
		if (!this.subject) {
			this.subject = this.create(url);
			console.log('Successfuly connected to: ' + url);
		}
		return this.subject;
	}

	private create(url): Rx.Subject<MessageEvent> {
		let ws = new WebSocket(url);

		let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
			ws.onmessage = obs.next.bind(obs);
			ws.onerror = obs.error.bind(obs);
			ws.onclose = obs.complete.bind(obs);

			return ws.close.bind(ws);
		});

		setTimeout(() => {
			this.sendMsg(ws);
		}, 3000);

		let observer = {
			next: (data: Object) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
					console.log(data);
				}
			}
		};

		return Rx.Subject.create(observer, observable);
	}

	sendMsg(websocket) {
		this.yesterday.setDate(this.today.getDate() - 1);
		let subscribeData = { timeRange: this.getWSDateFormat([ this.today, this.yesterday ]) };
		websocket.send(JSON.stringify(subscribeData));
	}

	getWSDateFormat(datesArr) {
		console.log(datesArr);
		let results = [];
		datesArr.forEach((date) => {
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var year = date.getFullYear();

			results.push(`${month}_${day}_${year}`);
		});
		return results;
	}
}
