import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { OrganisationNotificationService } from '../../../customerapp-module/api-services/orgainzation-setting-module-services/organisation-notifications-service/organisation-notifications-service.service';
@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailVerificationComponent>,private _notificationService:OrganisationNotificationService) { }

  otp: string;
  data: any;
  errorMessage: string = "";
  showOtpComponent = true;
  countDown=20;
  resentOTPcount=0;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
    },
    containerStyles: {
      'display': 'flex',
      'justify-content':
      'center','margin': '20px'
    }
  };

  ngOnInit(): void {
    setTimeout(() => {
      this.resentOTP();
    }, 10);
   }

  onOtpChange(otp) {
    this.otp = otp;

    if (otp.length == 4 ) {
      // Verify in backend
      this._notificationService.verifyEmailOTP({'otp_text': otp}).subscribe((res: any) => {
        this.dialogRef.close(res);
        this.errorMessage = "";
      }, (err: any) => {
        this.errorMessage = err.error.message;
      })
    }
  }

  resentOTP(){
     this.resentOTPcount++;
     this.sendOTP();
     const sec = interval(1000)
     let unsec= sec.subscribe(sec=>{
       this.countDown--;
       if(sec==20){
        unsec.unsubscribe();
        this.countDown=20;
       }
     })

   }

   sendOTP(){
    this._notificationService.sendVerificationCode({"email": this.data.email}).subscribe((res: any) => {
      this.errorMessage = "";
    }, (err: any) => {
        this.errorMessage = err.error.message;

    });
  }

}
