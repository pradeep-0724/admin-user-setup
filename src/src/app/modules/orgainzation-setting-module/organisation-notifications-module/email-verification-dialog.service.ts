import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EmailVerificationComponent } from './email-verification/email-verification.component';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationDialogService {

  constructor(private dialog: MatDialog) { }

  // open dialog onclick on move button
  public enterOTPDialogService(data): Observable<any> {
    let dialogRef: MatDialogRef<EmailVerificationComponent>;
    dialogRef = this.dialog.open(EmailVerificationComponent);
    dialogRef.componentInstance.data = data;
    return dialogRef.afterClosed();
  }
}