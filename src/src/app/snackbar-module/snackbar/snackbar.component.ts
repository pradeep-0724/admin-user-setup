import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent  {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: string },
    public snackBarRef: MatSnackBarRef<SnackbarComponent>
  )
   {
   }
  getIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle'; 
      case 'error':
        return 'error';  
      case 'warning':
        return 'warning'; 
      case 'info':
        return 'info'; 
      default:
        return 'notifications';  
    }
  }
}
