import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollToTop {

 scrollToTop(){
    const main_content= document.getElementById('section')
    main_content.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
 }
}
