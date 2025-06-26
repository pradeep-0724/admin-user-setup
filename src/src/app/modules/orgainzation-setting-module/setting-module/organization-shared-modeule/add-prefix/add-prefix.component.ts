
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, AbstractControl,UntypedFormControl ,UntypedFormArray} from '@angular/forms';
import { TransportValidator } from '../../../../../shared-module/components/validators/validators';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import * as moment from "moment";
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-prefix',
  templateUrl: './add-prefix.component.html',
  styleUrls: ['./add-prefix.component.scss']
})
export class AddPrefixComponent implements OnInit,AfterViewInit {
  successMsg:boolean = false;
  updateText:any= "Update";
  hideTime:any = 5000;
  prefixform:UntypedFormGroup;
  @Input() key:string;
  @Input() parentForm ?: UntypedFormGroup;
  @Input() isFormValid? = new Observable();
  @Input() canShowUpdateButton : boolean = true;

  screenname=''
  terminology :any;
  constructor(private _fb:UntypedFormBuilder,private _settingService:SettingSeviceService,private _terminologiesService:TerminologiesService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.parentForm) {
        this.parentForm.addControl('prefix_form', this.prefixform)
      }    
    }, 2000);
  }

  ngOnInit() {
    this.formBuild();
    this.getPrefix();
    this.terminology = this._terminologiesService.terminologie
    this.getScreenName(this.key);
    
    this.isFormValid.subscribe((valid)=>{
      if(!valid){
        this.setAsTouched(this.prefixform)
      }
    })
    
  }

  formBuild(){
    this.prefixform= this._fb.group({
      alpha_prefix:['',[Validators.required,Validators.maxLength(5),Validators.pattern('^[A-Z0-9]*$')]],
      is_year:[false],
      is_month:[false],
      is_day:[false],
      starting_index:['',[Validators.pattern('^[0-9]*$'),Validators.required]],
      sample:''
    })
  }

  changeInFields(){
      this.getSample( this.prefixform.value)
  }

  getPrefix(){
    this._settingService.getPrefix(this.key).subscribe(data=>{
      this.patchForm(data['result'])
    })
  }

  patchForm(data){
   let form =  this.prefixform;
   form.patchValue(data)
  }

  getSample(data){
    let year='',
        month='',
        day='',
        sampleyear='',
        samplemonth='',
        sampleday=''
        year=moment(new Date(dateWithTimeZone())).format("YYYY")
        month=moment(new Date(dateWithTimeZone())).format("MM")
        day=moment(new Date(dateWithTimeZone())).format("DD")
        let form = this.prefixform;
        if(data.is_year){
          sampleyear=year
        }
        if(data.is_month){
          samplemonth=month
        }
        if(data.is_day){
          sampleday=day
        }
        let lastsample = sampleyear+samplemonth+sampleday
        form.patchValue({
          sample:data.alpha_prefix.toUpperCase()+lastsample.trim()+data.starting_index,
          alpha_prefix:data.alpha_prefix.toUpperCase()
        })
        this.checkSerialNumberLength(form);
  }

  upadtePrefix(){
    let form = this.prefixform;
    if(form.valid){


      let payload= {
        "key": this.key,
        "data": form.value
    }
    this._settingService.postPrefix(payload).subscribe(data=>{
      this.updateText = "Update";
      this.successMsg = true;
      setTimeout(() => {
        this.successMsg = false;
        this.updateText = " Update ";

      }, 5000);
      this.getPrefix();



    })

  }else{
    this.setAsTouched(form);
  }
}

checkSerialNumberLength(form){
   let checklength=[]
   checklength= form['value'].sample.split('');
   if(checklength.length>16){
     form.get('starting_index').setValidators([Validators.maxLength(3),Validators.required,Validators.pattern('^[0-9]*$')]);
     form.get('starting_index').updateValueAndValidity();
   }else{
    form.get('starting_index').setValidators([Validators.maxLength(6), Validators.required,Validators.pattern('^[0-9]*$')]);
    form.get('starting_index').updateValueAndValidity();
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

getScreenName(key){
  let screenNames=[
    {
      key:'vehicleinspection',
      name: 'Vehicle Inspection'
    },
    {
    key:'bankactivity',
    name:'Bank Activity'
  },
  {
    key:'ms',
    name:'Market Vehicle Slip'
  },
  {
    key:'lorrychallan',
    name:'Market Vehicle'
  },
  {
    key:'consignmentnote',
    name:'Delivery Note'
  },
  {
    key:'invoice',
    name:'Invoice'
  },
  {
    key:'debitnote',
    name:'Debit Note'
  },
  {
    key:'proformainvoice',
    name:'Proforma Invoice'
  },
  {
    key:'creditnote',
    name:'Credit Note'
  },
  {
    key:'journalentry',
    name:'Journal Entry'
  },
  {
    key:'settlement',
    name:'Payment Settlement'
  },
  {
    key:'advance',
    name:'Payment Advance'
  },
  {
    key:'refund',
    name:'Payment Refund'
  },
  {
    key:'purchase_order',
    name:'Purchase Order'
  },
  {
    key:'bos',
    name:'Bill Of Supply'
  },
  {
    key:'operation_bill',
    name:'Bill Payment'
  },
  {
    key:'vendor_advance',
    name:'Vendor Advance'
  },
  {
    key:'workorder',
    name:'Sales Order'
  },
  {
    key:'vehicle_booking',
    name:'Vehicle Booking'
  },{
    key:'builty',
    name:this.terminology.online_bilty
  },
  {
    key:'quotation',
    name: 'Quotation'
  },
  {
    key:'job_card',
    name: 'Job Card'
  },
  {
    key:'trip',
    name: 'Job'
  },
  {
    key:'tripdeliverynote',
    name: 'Delivery Note'
  },
  {
    key:'siteinspection',
    name: 'Site Inspection'
  },
  {
    key:'lpo',
    name: 'Local Purchase Order'
  }

]
let screenName=[];
  screenName= screenNames.filter(item => item.key==key);
  this.screenname= screenName[0].name
}
}
