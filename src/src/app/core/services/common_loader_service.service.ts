import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CommonLoaderService {

    getHide() {
        let loader = document.querySelector('ngx-ui-loader');
        if (loader) {
            loader.setAttribute("style", "display:none;");
        }
    }

    getShow() {
        let loader = document.querySelector('ngx-ui-loader');
        if (loader) {
            loader.setAttribute("style", "display:block;");
        }
    }


}