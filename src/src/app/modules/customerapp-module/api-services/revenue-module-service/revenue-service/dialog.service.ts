import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MoveDialogComponent } from '../../../revenue-module/trip-module/company-vehicle-module/list-trip/move-dialog/move-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  // open dialog onclick on move button
  public onMoveDialog(date, reg_number, tripData): Observable<any> {
    let dialogRef: MatDialogRef<MoveDialogComponent>;
    dialogRef = this.dialog.open(MoveDialogComponent);
    dialogRef.componentInstance.startDate = new Date(date);
    dialogRef.componentInstance.reg_number = reg_number;
    dialogRef.componentInstance.tripData = tripData;
    return dialogRef.afterClosed();
  }
}
