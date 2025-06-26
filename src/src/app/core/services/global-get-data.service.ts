import { Injectable } from '@angular/core';
import { Observable, combineLatest as combineLatestRx, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {
  private readonly retryAttempts = 2; 

  constructor() { }

  private retryObservable<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(
     retry(this.retryAttempts),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error);
      })
    );
  }

  combineLatest(observables: Observable<any>[]): Observable<any[]> {
    const retryableObservables = observables.map(observable =>
      this.retryObservable(observable)
    );
    return combineLatestRx(retryableObservables);
  }
}
