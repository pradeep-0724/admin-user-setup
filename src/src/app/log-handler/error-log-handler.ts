import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from '../core/services/logging.service';
import { ErrorService } from '../core/services/error.service';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse) {

        const errorService = this.injector.get(ErrorService);
        const logger = this.injector.get(LoggingService);

        let message;
        let stackTrace;

        if (error instanceof HttpErrorResponse) {
            // Server Error
            message = errorService.getServerMessage(error);
            stackTrace = errorService.getServerStack(error);
        } else {
            // Client Error
            const chunkFailedMessage = /Loading chunk [\d]+ failed/;
            message = errorService.getClientMessage(error);
            stackTrace = errorService.getClientStack(error);
            if (chunkFailedMessage.test(message)){
                let value= confirm("The Site has been updated with New Content, Please Click on Ok to Load it !");
                if(value){
                 sessionStorage.clear();
                    if (caches) {
                      caches.keys().then(keys => {
                        keys.forEach(key => {
                          caches.delete(key);
                        });
                      });
                    }
                window.location.reload();
                }
            }else{
                logger.logError(message, stackTrace);
            }
        }
    }
}
   
   