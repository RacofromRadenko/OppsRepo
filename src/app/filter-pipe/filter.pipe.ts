import { Pipe, PipeTransform } from '@angular/core';
import { Data } from '../services/FetchFromBe/fetch-data.service';

@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(someArray: any[], terms: Data): any {
		if (terms === undefined) {
			return someArray;
		} else {
			return someArray.filter((array) => {
				return array.TraidingPair;
			});
		}
	}
}
