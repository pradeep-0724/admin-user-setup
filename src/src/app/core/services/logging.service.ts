import { Injectable, InjectionToken, Injector } from '@angular/core';
import * as Rollbar from 'rollbar';
import { environment } from '../../../environments/environment';


export const RollbarService = new InjectionToken<Rollbar>('rollbar');


const rollbarConfig = {
    accessToken: 'be494871e63d4514a9d682340c0f0911',
    captureUncaught: true,
    captureUnhandledRejections: true,
   };
   
   export function rollbarFactory() {
    return new Rollbar(rollbarConfig)
   }



@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(private injector: Injector) {}

    logError(message: string, stack: any) {

    if (environment.error_reporting) {
      const rollbar = this.injector.get(RollbarService);
      // Send errors to be saved here
      rollbar.error(message, stack);
    } else {
      console.error(message);
      console.error(stack);
    }
  }
}