import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConsoleLogService {

  constructor() { }


  disableConsoleInProduction(): void {
    if (false) {
      console.log = function (): void { };
      console.debug = function (): void { };
      console.warn = function (): void { };
      console.info = function (): void { };
    }
  }



}
