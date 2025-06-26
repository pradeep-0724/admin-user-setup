import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class TabIndexService  {
  tabIndexRemove(){
    let tabIndex:any = document.querySelectorAll('.removeTabIndex .mat-sort-header-container');
    tabIndex.forEach((tab) => {
      if (tab.hasAttribute('tabindex')) {
        tab.setAttribute('tabindex', '-1')
      }
    })
  }
  negativeTabIndex(){
    let disabledInput:any = document.querySelectorAll('.input-wrap,.readonlyStyles,div');
     disabledInput.forEach((cls)=>{
      if(cls.classList.value.includes('disableInput')){
        let callInput = cls.querySelectorAll('input');
        callInput.forEach((tab)=>{
          tab.setAttribute('tabindex', '-1');
        })
      }
      if(cls.classList.value.includes('disabled')){
        let callInput = cls.querySelectorAll('input');
        callInput.forEach((tab)=>{
          tab.setAttribute('tabindex', '-1');
        })
      }
      if(cls.classList.value.includes('disable')){
        let callInput = cls.querySelectorAll('input, button');
        callInput.forEach((tab)=>{
          tab.setAttribute('tabindex', '-1');
        })
      }
    })
  }
}
