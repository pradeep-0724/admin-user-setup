import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class popupOverflowService{
  popupActive(){
    document.body.style.overflow = "hidden";

  }
  popupHide(){
    document.body.style.overflow="auto";
  }


}
