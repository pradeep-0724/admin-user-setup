import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/snackbar-module/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {}

    showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        duration: duration,
        data: { message, type },
        panelClass: ['app-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }
