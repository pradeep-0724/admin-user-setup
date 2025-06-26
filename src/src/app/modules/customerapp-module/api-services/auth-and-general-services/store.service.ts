import { CommonStateType } from '../../../../stores/common.reducer';
import { Injectable } from '@angular/core';
import { Store} from '@ngrx/store';
import { SetStoreValue, ResetStoreValue, ClearStoreValues } from '../../../../stores/common.actions';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  state: Observable<CommonStateType>;

  constructor(private store: Store <CommonStateType>) {
    this.state = this.store.select('store');
  }

  setToStore(storeKeyName: string, options: any) {
    const setAction = new SetStoreValue(storeKeyName, options);
    this.store.dispatch(setAction);
  }

  getFromStore(storeKeyName: string) {
    return this.state.pipe(mergeMap((data) => {
      return of(data[storeKeyName]);
    }));
  }

  resetInStore(storeKeyName: string) {
    const resetAction = new ResetStoreValue(storeKeyName);
    this.store.dispatch(resetAction);
  }

  clearStore() {
    const clearAction = new ClearStoreValues();
    this.store.dispatch(clearAction);
  }

}
