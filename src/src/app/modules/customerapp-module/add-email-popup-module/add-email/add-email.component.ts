import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject } from 'rxjs';
import { EmailService } from './email-service.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';


@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {
  public separatorKeysCodes = [ENTER, COMMA];
  public toEmailList = [];
  public bccEmailList = [];
  public ccEmailList = [];
  apiError=''
  removable = true;
  isOpen =false;
  rulesForm: UntypedFormGroup;
  fb: UntypedFormBuilder = new UntypedFormBuilder();
  @Input()filebyteCode =new BehaviorSubject(null);
  emailFiles = new BehaviorSubject([]);
  image:any;
  pdfFiles=[];
  @Output() closeDialog  = new EventEmitter();
  dataFromChild:any={};

  constructor( private _sendEmail:EmailService,private commonloaderservice: CommonLoaderService,){

  }
  add(event,emailFor): void {
    if (event.value) {
      if (this.validateEmail(event.value)) {
        switch (emailFor) {
          case 'to_emails':
            this.toEmailList.push({ value: event.value, invalid: false });
            break;
            case 'bcc_emails':
              this.bccEmailList.push({ value: event.value, invalid: false });
            break;
          default:
            this.ccEmailList.push({ value: event.value, invalid: false });
            break;
        }
      } else {
        switch (emailFor) {
          case 'to_emails':
            this.toEmailList.push({ value: event.value, invalid: true });
            this.checkEmailValidity(this.toEmailList,emailFor);
            break;
            case 'bcc_emails':
              this.bccEmailList.push({ value: event.value, invalid: true });
              this.checkEmailValidity(this.bccEmailList,emailFor);
            break;
          default:
            this.ccEmailList.push({ value: event.value, invalid: true });
            this.checkEmailValidity(this.ccEmailList,emailFor);
            break;
        }
        this.rulesForm.controls[emailFor].setErrors({'incorrectEmail': true});
      }
    }
    if (event.input) {
      event.input.value = '';
    }
  }


  removeEmail(data: any,removeFor): void {
    switch (removeFor) {
      case 'to_emails':
        if (this.toEmailList.indexOf(data) >= 0) {
          this.toEmailList.splice(this.toEmailList.indexOf(data), 1);
          this.checkEmailValidity(this.toEmailList,removeFor);
        }
        break;
        case 'bcc_emails':
          if (this.bccEmailList.indexOf(data) >= 0) {
            this.bccEmailList.splice(this.toEmailList.indexOf(data), 1);
            this.checkEmailValidity(this.bccEmailList,removeFor);
          }
        break;
      default:
        if (this.ccEmailList.indexOf(data) >= 0) {
          this.ccEmailList.splice(this.toEmailList.indexOf(data), 1);
          this.checkEmailValidity(this.ccEmailList,removeFor);
        }
        break;
    }
  }

  ngOnInit() {
    this.rulesForm = this.fb.group({
      to_emails: this.fb.array([], [this.validateArrayNotEmpty]),
      bcc_emails: this.fb.array([], [this.validateArrayNotEmpty]),
      cc_emails: this.fb.array([], [this.validateArrayNotEmpty]),
      subject:['',[Validators.required,Validators.max(150)]],
      content :['',[Validators.maxLength(1000)]],
      documents:[[],[Validators.maxLength(1)]]

    });

    this.filebyteCode.subscribe(data=>{
    this.dataFromChild ={}
    this.dataFromChild= data;
    this.isOpen=data['isOpen']
    let fileUrl = 'data:application/pdf;base64,'+data['base64Code'];
    this.pathchEmailForm();
    this.pdfFiles.push(this.dataURLtoFile(fileUrl,data['fileName']+'.pdf'))
    this.emailFiles.next(this.pdfFiles);
 })

  }

  private validateArrayNotEmpty(c: UntypedFormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  fileUploader(filesUploaded) {
    let documents = this.rulesForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }

  fileDeleted(deletedFileIndex) {
    let documents = this.rulesForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
    }

    checkEmailValidity(data,type){
        if(data.length==0){
          this.rulesForm.controls[type].setErrors({'incorrectEmail':false});
        }
        data.forEach(element => {
          if(element['invalid'])
          {
            this.rulesForm.controls[type].setErrors({'incorrectEmail':true});
            return
          }else{
            this.rulesForm.controls[type].setErrors({'incorrectEmail':false});
          }
        });
    }


    dataURLtoFile(dataurl, filename){
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

     let file =new File([u8arr], filename, {type:mime});
    return file
  }

  close(){
    this.pdfFiles=[];
    this.closeDialog.emit(true)
    this.isOpen = false;

  }

  pathchEmailForm()
{
    let form = this.rulesForm;
    form.patchValue({
     content :this.dataFromChild['content'],
     subject:this.dataFromChild['subject'],
    })

    if(this.dataFromChild['email']){
      this.toEmailList.push(
        { value:this.dataFromChild['email'] , invalid: false }
      )
    }

}

submit(){
        let toEmail=[],
        form = this.rulesForm,
        bccEmail=[],
        ccEmail=[],
        toEmailIds=[],
        bccEmailIds=[],
        ccEmailIds=[]
      toEmail=this.toEmailList.filter(item => item.invalid ==false);
      bccEmail=this.bccEmailList.filter(item => item.invalid ==false);
      ccEmail=this.ccEmailList.filter(item => item.invalid ==false);
      toEmailIds=toEmail.map(item => item.value);
      bccEmailIds=bccEmail.map(item => item.value);
      ccEmailIds=ccEmail.map(item => item.value);
      if(toEmail.length!==0 && form.get('subject').valid && toEmail.length<=10){
          let paylaod={"to_addresses":toEmailIds,
          "subject": form.value['subject'],
          "body":form.value['content'], 
          "attachments":form.value['documents'],
          "bccs":bccEmailIds,
          "ccs":ccEmailIds}
          this.commonloaderservice.getShow();
            this._sendEmail.postEmail(paylaod).subscribe(data=>{
              this.closeDialog.emit(true);
              this.pdfFiles=[];
              this.commonloaderservice.getHide();
            },(error)=>{
             this.apiError = error.error.message
             this.scrollToTop();
             this.commonloaderservice.getHide();
            })
      }else{
        this.apiError = "Either To email is missing  or  Suject is missing";
      }


}

scrollToTop(){
  const email_popup= document.getElementById('email-popup')
  email_popup.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
}

}
