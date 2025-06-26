import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-pdf-heading-native',
  templateUrl: './pdf-heading-native.component.html',
  styleUrls: ['./pdf-heading-native.component.scss']
})
export class PdfHeadingNativeComponent implements OnInit {
  successMsg: boolean = false;
  updateText: any = "Update";
  hideTime: any = 5000;
  pdfHeadingForm: UntypedFormGroup;
  @Input() key: string='';
  @Input() parentForm ?: UntypedFormGroup;
  @Input() isFormValid? = new Observable();
  @Input() canShowUpdateButton : boolean = true;

  screenname = ''
  constructor(private _fb: UntypedFormBuilder, private _settingService: SettingSeviceService) { }

  ngOnInit() {
    this.formBuild();
    this.getPdfHeading();
    this.getScreenName(this.key)
    if (this.parentForm) {
      this.parentForm.addControl('pdf_heading', this.pdfHeadingForm)
    }
    this.isFormValid.subscribe((valid)=>{
      if(!valid){
        this.setAsTouched(this.pdfHeadingForm)
      }
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.parentForm) {
        this.parentForm.addControl('pdf_heading', this.pdfHeadingForm)
      }    
    }, 2000);
  }

  formBuild() {
    this.pdfHeadingForm = this._fb.group({ 
      tax_head_in_eng: ['', [Validators.required, Validators.maxLength(20)]],
      tax_head_in_native: [''],
    })
  }

  getPdfHeading() {
    this._settingService.getPdfHeading(this.key).subscribe(data => {
     this.patchForm(data['result'])
    })
  }

  patchForm(data) {
    let form = this.pdfHeadingForm;
    form.patchValue(data)
  }

  upadtePdfHeading() {
    let form = this.pdfHeadingForm;
    if (form.valid) {
      let payload = {
        "key": this.key,
        "data": form.value
      }
      this._settingService.postPdfHeading(payload).subscribe(data => {
        this.updateText = "Update";
        this.successMsg = true;
        setTimeout(() => {
          this.successMsg = false;
          this.updateText = " Update ";

        }, 5000);
        this.getPdfHeading();
      })

    } else {
      this.setAsTouched(form);
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  getScreenName(key) {
    let screenNames = [

      {
        key: 'invoice',
        name: 'Invoice Heading'
      },
      {
        key:'debitnote',
        name:'Debit Note Heading'
      },
      {
        key:'creditnote',
        name:'Credit Note Heading'
      },
    ]
    let screenName = [];
    screenName = screenNames.filter(item => item.key == key);
    this.screenname = screenName[0].name
  }
}