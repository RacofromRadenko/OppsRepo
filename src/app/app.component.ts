import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FetchDataService } from './services/FetchFromBe/fetch-data.service';
import { TimeServiceService } from './services/time-service/time-service.service';
import { HttpClient } from '@angular/common/http';
import { ApiClientService } from './api-client/api-client.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
	subscription: Subscription;

	tableFlag: boolean = false;
	flag: boolean = false;
	percentage = ' %';
	realTime: number;
	someArray = [];
	helpArray = [];
	getOppsData = [];
	object: any;
	fourFlag: boolean = true;
	opportunitiesArray = [];
	mainFlag: boolean = false;
	bestFifty: boolean = false;
	twentyFourFlag: boolean = false;
	eightFlag: boolean = false;
	sixteenFlag: boolean = false;
	downloadFlag: boolean = false;
	bestTenInPast4Hours = [];
	bestInPastEightHours = [];
	bestInPastSixteenHours = [];
	bestTwelveByProfitInPast24Hours = [];
	bestFiftyByProfitInPast24Hours = [];
	downloadHelpArray = [];
	textArea: string = '';
	btcUSDPrice: number = null;
	ethUSDPrice: number = null;
	convertFromEUROtoUSD: number = null;
	constructor(public fetchFromBE: FetchDataService, public time: TimeServiceService, private api: ApiClientService) {
		this.fetchDataFromBackend();
		this.getCryptoValue();
		this.fromEUROtoUSD();
	}

	fetchDataFromBackend() {
		this.fetchFromBE.dataBE.subscribe((response) => {
			for (let i = 0; i < response.arb_opportunities.length; i++) {
				response.arb_opportunities[i]['calculatedProfit'] = null;
				response.arb_opportunities[i]['calculatedProfitInUSD'] = null;
			}
			if (response.arb_opportunities.length !== undefined) {
				this.mainFlag = true;
				this.getPair(response.arb_opportunities);
				console.log('opps array', response.arb_opportunities);
				this.opportunitiesArray = this.bestByProfitArrayInUSD(
					this.massiveHumanTimestamp(response.arb_opportunities)
				);
				this.helpArray = this.massiveHumanTimestamp(response.arb_opportunities);
				this.profitForArrayOpps(this.opportunitiesArray);
			} else {
				this.getPair(response.arb_opportunities);
				this.object = response.arb_opportunities;
				// this.bestsByProfitObjectInUSD(this.object);
				this.opportunitiesArray.unshift(
					this.humanTimeStamp(this.bestByProfitArrayInUSD(response.arb_opportunities))
				);
				this.profitForObjectOpps(this.object);
				this.opportunitiesArray.pop();
			}
		});
	}

	massiveHumanTimestamp(inputArray) {
		let res = [];
		let newElement;
		inputArray.forEach((element) => {
			newElement = element;
			newElement.hTimeStamp =
				new Date(element.Timestamp * 1000).toLocaleDateString() +
				' ' +
				new Date(element.Timestamp * 1000).toLocaleTimeString();
			res.push(newElement);
		});

		return res;
	}

	humanTimeStamp(inputElement) {
		let res;
		res = inputElement;
		res.hTimeStamp = inputElement.hTimeStamp =
			new Date(inputElement.Timestamp * 1000).toLocaleDateString() +
			' ' +
			new Date(inputElement.Timestamp * 1000).toLocaleTimeString();
		return res;
	}

	realTimeOpps() {
		this.receiveData(this.helpArray);
		this.oneByOne(this.object);
		this.tableFlag = true;
		this.downloadFlag = false;
		this.bestFifty = false;
		this.fourFlag = false;
		this.eightFlag = false;
		this.sixteenFlag = false;
		this.twentyFourFlag = false;
		this.bestFifty = false;
	}

	oneByOne(result) {
		this.someArray.unshift(result);
		this.flag = true;
		this.fourFlag = false;
		this.twentyFourFlag = false;
	}

	receiveData(result) {
		let arraySort;
		this.someArray.push(result);
		arraySort = this.opportunitiesArray.sort(function(a, b) {
			return b.Timestamp - a.Timestamp;
		});
		this.textArea = 'Live data. ';
		this.flag = true;
		this.fourFlag = false;
		this.twentyFourFlag = false;
	}

	getTopOPps(startTime, endTime, topPlaces, inputArray) {
		let result = [];
		if (startTime < endTime) {
			for (let i = 0; i < inputArray.length; i++) {
				if (inputArray[i].Timestamp < endTime) {
					if (inputArray[i].Timestamp > startTime) {
						result.push(inputArray[i]);
					}
				}
			}
		}
		result.sort((a, b) => {
			return b.Profit - a.Profit;
		});
		result = result.slice(0, topPlaces);

		return result;
	}

	profitForArrayOpps(inputArray) {
		let result = [];
		let inputElement;

		inputArray.forEach((element) => {
			inputElement = element;
			inputElement.Profit = element.Profit = (element.Profit * 100).toString().substring(0, 4);
			result.push(inputElement);
		});
		return result;
	}

	profitForObjectOpps(inputObject) {
		let inputElement;
		inputElement = inputObject;
		inputElement.Profit = (inputObject.Profit * 100).toString().substring(0, 4);
		return inputElement;
	}

	public bestTenInPastFourHours() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let endTime = Math.floor(new Date().getTime() / 1000);
		let startTime = endTime - 14400;
		let timeRange = this.time.getTimeInterval(startTime, endTime, 1);
		this.bestTenInPast4Hours = this.getTopOPps(timeRange[0][0], timeRange[0][1], 10, helperOppsArray);
		this.downloadHelpArray = this.bestTenInPast4Hours;
		this.textArea = 'The best ten opportunities (by profit) in the past four hours. ';
		this.flag = false;
		this.tableFlag = true;
		this.fourFlag = true;
		this.twentyFourFlag = false;
		this.bestFifty = false;
		this.eightFlag = false;
		this.sixteenFlag = false;
		this.downloadFlag = true;
	}

	public bestTwelveInTwentyFour() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let endTime = Math.floor(new Date().getTime() / 1000);
		let startTime = endTime - 86400;
		let timeRange = this.time.getTimeInterval(startTime, endTime, 6);
		let tmpOpps = [];
		let element = null;
		for (let x = 0; x < 6; x++) {
			element = this.getTopOPps(timeRange[x][0], timeRange[x][1], 2, helperOppsArray);
			tmpOpps = tmpOpps.concat(element);
		}

		this.bestTwelveByProfitInPast24Hours = tmpOpps;
		this.downloadHelpArray = this.bestTwelveByProfitInPast24Hours;
		this.textArea = 'The best two (by period) opportunities from last six 4-hour periods. ';
		this.twentyFourFlag = true;
		this.tableFlag = true;
		this.fourFlag = false;
		this.eightFlag = false;
		this.bestFifty = false;
		this.sixteenFlag = false;
		this.flag = false;
		this.downloadFlag = true;
	}

	bestFourInPastEightHours() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let endTime = Math.floor(new Date().getTime() / 1000);
		let startTime = endTime - 28400;
		let timeRange = this.time.getTimeInterval(startTime, endTime, 2);
		let element = null;
		let tmpOpps = [];

		for (let x = 0; x < 2; x++) {
			element = this.getTopOPps(timeRange[x][0], timeRange[x][1], 2, helperOppsArray);
			tmpOpps = tmpOpps.concat(element);
		}
		this.bestInPastEightHours = tmpOpps;
		this.downloadHelpArray = this.bestInPastEightHours;
		this.textArea = 'The best two (by period) opportunities from last two 4-hour periods. ';
		this.eightFlag = true;
		this.bestFifty = false;
		this.tableFlag = true;
		this.twentyFourFlag = false;
		this.fourFlag = false;
		this.flag = false;
		this.sixteenFlag = false;
		this.downloadFlag = true;
	}

	bestEightInPastSixteenHours() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let endTime = Math.floor(new Date().getTime() / 1000);
		let startTime = endTime - 57600;
		let timeRange = this.time.getTimeInterval(startTime, endTime, 4);
		let element = null;
		let tmpOpps = [];
		for (let x = 0; x < 4; x++) {
			element = this.getTopOPps(timeRange[x][0], timeRange[x][1], 2, helperOppsArray);
			tmpOpps = tmpOpps.concat(element);
		}
		this.bestInPastSixteenHours = tmpOpps;
		this.downloadHelpArray = this.bestInPastSixteenHours;
		this.textArea = 'The best two (by period) opportunities from last four 4-hour periods.';
		this.eightFlag = false;
		this.sixteenFlag = true;
		this.bestFifty = false;
		this.tableFlag = true;
		this.twentyFourFlag = false;
		this.fourFlag = false;
		this.flag = false;
		this.downloadFlag = true;
	}

	public bestFiftyInTwenyFour() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let tmpOpps = [];
		let element = null;
		let endTime = Math.floor(new Date().getTime() / 1000) + 7200;
		let startTime = endTime - 86400;
		element = this.getTopOPps(startTime, endTime, 50, helperOppsArray);
		tmpOpps = tmpOpps.concat(element);
		this.bestFiftyByProfitInPast24Hours = tmpOpps;
		this.downloadHelpArray = this.bestFiftyByProfitInPast24Hours;
		this.textArea = 'The best fifty opportunities (by profit) in past twentyfour hours. ';
		this.bestFifty = true;
		this.tableFlag = true;
		this.twentyFourFlag = false;
		this.sixteenFlag = false;
		this.eightFlag = false;
		this.fourFlag = false;
		this.flag = false;
		this.downloadFlag = true;
	}

	saveTextAsFile() {
		var result = this.downloadHelpArray;

		var textToSaveAsBlob = new Blob([], { type: 'text/plain' });
		for (let i = 0; i < result.length; i++) {
			textToSaveAsBlob = new Blob([ textToSaveAsBlob, '\n' + this.convertOppToString(result[i]) ], {
				type: 'text/plain'
			});
			var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
		}
		let currentDate = new Date().toLocaleString();
		var fileNameToSaveAs = currentDate + ' logfile';
		var downloadLink = document.createElement('a');
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = 'Download File';
		downloadLink.href = textToSaveAsURL;
		downloadLink.onclick = this.destroyClickedElement;
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);

		downloadLink.click();
	}
	destroyClickedElement(event) {
		document.body.removeChild(event.target);
	}

	convertOppToString = (inputOpp) => {
		let res = 'empty';
		if (inputOpp) {
			res = `Timestamp=${inputOpp.hTimeStamp}: Profit=${inputOpp.Profit}: Buy Exchange=${inputOpp.BuyExchange}: Sell Exchange=${inputOpp.SellExchange}: Assets=${inputOpp.TradingPair}: Highest Bid Price=${inputOpp.HighestBidPrice}: Lowest Ask Price=${inputOpp.LowestAskPrice}: Max Volume=${inputOpp.MaxVolume}: Spread=${inputOpp.Spread} `;
		}
		return res;
	};

	getPair(inputArrayOfOpps) {
		let TradingPair = null;
		let lastCharInString = null;
		let lastThreeCharsInString = null;
		let maxVolume = null;
		let spread = null;
		let USDT = null;
		let USD = null;
		let EUR = null;
		let BTC = null;
		let ETH = null;
		for (let i = 0; i < inputArrayOfOpps.length; i++) {
			TradingPair = inputArrayOfOpps[i].TradingPair;
			lastCharInString = TradingPair.slice(-1);
			lastThreeCharsInString = TradingPair.slice(-3);
			if (lastCharInString === 'T') {
				USDT = TradingPair.slice(-4);
				maxVolume = inputArrayOfOpps[i].MaxVolume;
				spread = inputArrayOfOpps[i].Spread;
				inputArrayOfOpps[i].calculatedProfit = (maxVolume * spread).toFixed(8) + ' USDT';
				inputArrayOfOpps[i].calculatedProfitInUSD = (maxVolume * spread).toFixed(2);
			} else if (lastThreeCharsInString === 'ETH') {
				ETH = TradingPair.slice(-3);
				maxVolume = inputArrayOfOpps[i].MaxVolume;
				spread = inputArrayOfOpps[i].Spread;
				inputArrayOfOpps[i].calculatedProfit = (maxVolume * spread).toFixed(8) + ' ETH';
				inputArrayOfOpps[i].calculatedProfitInUSD = (maxVolume * spread * this.ethUSDPrice).toFixed(2);
			} else if (lastThreeCharsInString === 'USD') {
				USD = TradingPair.slice(-3);
				maxVolume = inputArrayOfOpps[i].MaxVolume;
				spread = inputArrayOfOpps[i].Spread;
				inputArrayOfOpps[i].calculatedProfit = (maxVolume * spread).toFixed(8) + ' USD';
				inputArrayOfOpps[i].calculatedProfitInUSD = (maxVolume * spread).toFixed(2);
			} else if (lastThreeCharsInString === 'BTC') {
				BTC = TradingPair.slice(-3);
				maxVolume = inputArrayOfOpps[i].MaxVolume;
				spread = inputArrayOfOpps[i].Spread;
				inputArrayOfOpps[i].calculatedProfit = (maxVolume * spread).toFixed(8) + ' BTC';
				inputArrayOfOpps[i].calculatedProfitInUSD = (maxVolume * spread * this.btcUSDPrice).toFixed(2);
			} else if (lastThreeCharsInString === 'EUR') {
				EUR = TradingPair.slice(-3);
				maxVolume = inputArrayOfOpps[i].MaxVolume;
				spread = inputArrayOfOpps[i].Spread;
				inputArrayOfOpps[i].calculatedProfit = (maxVolume * spread).toFixed(8) + ' EUR';
				inputArrayOfOpps[i].calculatedProfitInUSD = (maxVolume * spread * this.convertFromEUROtoUSD).toFixed(2);
			}
		}

		return inputArrayOfOpps.calculatedProfit, inputArrayOfOpps.calculatedProfitInUSD;
	}

	getCryptoValue() {
		this.api.getDataFromAPI().subscribe((res) => {
			this.btcUSDPrice = JSON.parse(res.BTC.USD);
			this.ethUSDPrice = JSON.parse(res.ETH.USD);
		});
	}

	fromEUROtoUSD() {
		this.api.getCurrencyValueEUROBase().subscribe((result) => {
			this.convertFromEUROtoUSD = JSON.parse(result.rates.USD);
			console.log('from euro to USD', this.convertFromEUROtoUSD);
		});
	}

	bestByProfitArrayInUSD(arr) {
		let toUSD = ' USD';
		let res = [];
		if (arr.length !== undefined) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].calculatedProfitInUSD >= 0.5) {
					arr[i].calculatedProfitInUSD = arr[i].calculatedProfitInUSD + toUSD;
					res.push(arr[i]);
				}
			}
		}

		return res;
	}

	bestsByProfitObjectInUSD(obj) {
		let toUSD = ' USD';
		let helpObject = obj;
		console.log('object', obj);
		if (helpObject.calculatedProfitInUSD >= 0.5) {
			helpObject = helpObject.calculatedProfitInUSD + toUSD;
			console.log('help object', helpObject);
		}
		return helpObject;
	}

	//in progress
	realProfit(arr) {
		const fees = 0.4;
		let ProfitPerc = null;
		let result = null;
		for (let i = 0; i < arr.length; i++) {
			ProfitPerc = arr[i].Profit - fees;
			result = (arr[i].calculatedProfit - ProfitPerc) / arr[i].Profit;
		}
		return result;
	}

	ngOnDestroy() {
		// Only need to unsubscribe if its a multi event Observable
		this.subscription.unsubscribe();
	}
}
