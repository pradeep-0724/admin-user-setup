import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {
  constructor(private snackbar: SnackbarService) {}

  handleRequest<T>(request: Observable<T>, successMessage?: string): Observable<T> {
    return request.pipe(
      tap(() => {
        if (successMessage && environment.snackBar) {
          this.snackbar.showMessage(successMessage, 'success'); 
        }
      }),
      catchError((error) => {
        let errorMessage = error?.error?.message || 'Something went wrong!';
        if(typeof errorMessage === 'string' && environment.snackBar) {
          this.snackbar.showMessage(errorMessage, 'error');
        }else{
          errorMessage='Something went wrong!';
        }
        return throwError(error); 
      }),
      finalize(() => {
      })
    );
  }
}
