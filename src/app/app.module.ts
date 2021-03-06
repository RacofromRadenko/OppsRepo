import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WebsocketService } from './services/WebsocketService/websocket.service';
import { FetchDataService } from './services/FetchFromBe/fetch-data.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [ AppComponent ],
	imports: [ BrowserModule, NgxPaginationModule, FormsModule, HttpClientModule ],
	providers: [ FetchDataService, WebsocketService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
