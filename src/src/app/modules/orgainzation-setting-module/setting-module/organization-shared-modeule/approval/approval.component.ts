import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit, OnDestroy {

  constructor(private _fb: FormBuilder, private _commonloaderservice: CommonLoaderService, private _approvalSettingsService: SettingSeviceService) { }

  approvalForm: FormGroup
  usersList = [];
  initialValues = {
    default: [],
    awp:[],
    crane:[],
    container:[],
    others:[],
  };
  successMsg: boolean = false;
  updateText: any = "Update";
  @Input() key: string;
  @Input() isCrane=true;
  @Input() isAwp=true;
  @Input() isContainer=true;
  @Input() isCargo=true;
  @Input() isOthers=true;
  screenname = ''
  isIdDuplicatedFor={
   default:false,
   crane:false,
   awp:false,
   container:false,
   others:false,
  }
  isTabError={
    crane:false,
    awp:false,
    container:false,
    others:false,
  }
  selectedCategory='crane'
  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }
  
  ngOnInit(): void {
    this.approvalForm = this._fb.group({
      approval_type:0,
      default:this._fb.array([]),
      crane:this._fb.array([]),
      awp:this._fb.array([]),
      container:this._fb.array([]),
      others:this._fb.array([]),
      notify_approver: false,
      notify_submitter: false
    })
    this._approvalSettingsService.getApprovalsSettings(this.key).subscribe(resp => {
      this.usersList = resp['result']['users'];
      this.patchApprovals(resp['result'])
    })
    this._commonloaderservice.getHide();
    this.getScreenName(this.key)
  }

  onSubmit() {
    let form = this.approvalForm
    this.hideTabError();
    let isNoDuplicated=!this.isIdDuplicatedFor.awp && !this.isIdDuplicatedFor.crane&&!this.isIdDuplicatedFor.container && !this.isIdDuplicatedFor.default&&!this.isIdDuplicatedFor.others
    if (form.valid && isNoDuplicated ) {
      this._approvalSettingsService.updateApproval(this.key, this.prepareRequest(form.value)).subscribe(resp => {
        this.successMsg = true;
        setTimeout(() => {
          this.successMsg = false;
        }, 2000);
      })
    } else {
      setAsTouched(form)
      console.log(form,this.isIdDuplicatedFor)
      this.isTabError={
        crane:this.approvalForm.get('crane').invalid || this.isIdDuplicatedFor.crane,
        awp:this.approvalForm.get('awp').invalid|| this.isIdDuplicatedFor.awp,
        container:this.approvalForm.get('container').invalid|| this.isIdDuplicatedFor.container,
        others:this.approvalForm.get('others').invalid|| this.isIdDuplicatedFor.others,
      }
    }
  }

  hideTabError(){
    this.isTabError={
      crane:false,
      awp:false,
      container:false,
      others:false,
      }
  }

  prepareRequest(formValue){
    let defaultApprovals=formValue['default'].length==0?[]:formValue['default'].map(val => val.id).filter(item=>item!==null);
    let payload={
      "is_approval_configured":formValue['approval_type']==1?true:false,
      "are_different_level_approvers":formValue['approval_type']==2?true:false,
      "notify_approver":formValue['notify_approver'],
      "notify_submitter":formValue['notify_submitter'],
      "approvals": {
        "crane":formValue['approval_type']==1?defaultApprovals:formValue['crane'].length==0?[]:formValue['crane'].map(val => val.id).filter(item=>item!==null),
        "awp":formValue['approval_type']==1?defaultApprovals:formValue['awp'].length==0?[]: formValue['awp'].map(val => val.id).filter(item=>item!==null),
        "container":formValue['approval_type']==1?defaultApprovals:formValue['container'].length==0?[]: formValue['container'].map(val => val.id).filter(item=>item!==null),
        "others":formValue['approval_type']==1?defaultApprovals:formValue['others'].length==0?[]: formValue['others'].map(val => val.id).filter(item=>item!==null),
      }
    }

    return payload
  }

  addApproverRow(type) {
    const approvals = this.approvalForm.controls[type] as UntypedFormArray;
    approvals.push(this.itemApprover({}));
    this.initialValues[type].push(getBlankOption());
    this.setMandatoryNonMandatory()
  }

  buildApproverRow(items = [],type) {
    this.initialValues[type] = [];
    const approvals = this.approvalForm.controls[type] as UntypedFormArray;
    approvals.controls = []
    items.forEach(item => {
      approvals.push(this.itemApprover(item));
      this.initialValues[type].push(getBlankOption());
    })
  }

  addLabes(type){
    const approvals = this.approvalForm.controls[type] as UntypedFormArray;
    approvals.controls.forEach((item,index) => {
       if( item.value['id']){
        let userObj = this.usersList.find(user=> user.id==item.value['id'])
        this.initialValues[type][index]={label:userObj['name'],value:userObj['id']}
       }
  
    })

  }

  setMandatoryNonMandatory(){
    let fornTypes=['default','crane','awp','container','others']
    fornTypes.forEach(type=>{
      const approvals = this.approvalForm.controls[type] as UntypedFormArray;
      approvals.controls.forEach((form:FormGroup)=>{
      if(type=='default' || approvals.controls.length>1){
        setUnsetValidators(form,'id',[Validators.required])
      }else{
        setUnsetValidators(form,'id',[Validators.nullValidator]) 
      }
      })
    })
  

  }

  itemApprover(data: any) {
    return this._fb.group({
      id: data?.id || null
    })
  }

  removeApproverRow(index,type) {
    const advance = this.approvalForm.controls[type] as UntypedFormArray;
    advance.removeAt(index);
    this.initialValues[type].splice(index, 1);
    this.checkIdDuplicated(type)
    this.setMandatoryNonMandatory()
  }

  onApproverChange(type) {
    this.checkIdDuplicated(type)
  }

  onApprovelConfigureChange() {
    if (this.approvalForm.get('approval_type').value==1) {
      this.buildApproverRow([{}],'default')
    } else if (this.approvalForm.get('approval_type').value==2) {
      this.buildApproverRow([{}],'crane')
      this.buildApproverRow([{}],'awp')
      this.buildApproverRow([{}],'container')
      this.buildApproverRow([{}],'others')
    }else{
      this.buildApproverRow([],'default')
      this.buildApproverRow([],'crane')
      this.buildApproverRow([],'awp')
      this.buildApproverRow([],'container')
      this.buildApproverRow([],'others')
    }
    this.setMandatoryNonMandatory();
    this.hideTabError();

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  checkIdDuplicated(type) {
    const ids = this.approvalForm.value[type].map((item: any) => item.id);
    let isIdDublicate=ids.some((id: any, index: number) => id != null && ids.indexOf(id) !== index);
    switch (type) {
      case 'crane':
        this.isIdDuplicatedFor.crane = isIdDublicate
        break;
        case 'awp':
          this.isIdDuplicatedFor.awp = isIdDublicate
        break;
        case 'container':
          this.isIdDuplicatedFor.container = isIdDublicate
        break;
        case 'others':
          this.isIdDuplicatedFor.others = isIdDublicate
        break;
      default:
        this.isIdDuplicatedFor.default = isIdDublicate
        break;
    }
  
  }

  patchApprovals(data) {
    this.approvalForm.patchValue({
      notify_approver: data.notify_approver,
      notify_submitter: data.notify_submitter,
    })
    if(!data['are_different_level_approvers'] && data['is_approval_configured']){
      this.approvalForm.get('approval_type').setValue(1)
      this.buildApproverRow(data['approvals']['awp'],'default')
      this.addLabes('default')
    }
    if(!data['is_approval_configured']){
      this.approvalForm.get('approval_type').setValue(0)
    }
    if(data['are_different_level_approvers']){
      this.approvalForm.get('approval_type').setValue(2)
      this.buildApproverRow(data['approvals']['awp'],'awp')
      this.addLabes('awp')
      this.buildApproverRow(data['approvals']['crane'],'crane')
      this.addLabes('crane')
      this.buildApproverRow(data['approvals']['container'],'container')
      this.addLabes('container')
      this.buildApproverRow(data['approvals']['others'],'others')
      this.addLabes('others')
      if(data['approvals']['awp'].length==0){
        this.buildApproverRow([{}],'awp')
      }
      if(data['approvals']['crane'].length==0){
        this.buildApproverRow([{}],'crane')
      }
      if(data['approvals']['others'].length==0){
        this.buildApproverRow([{}],'others')
      }
      if(data['approvals']['container'].length==0){
        this.buildApproverRow([{}],'container')
      }
    }
   
  

  }

  getScreenName(key){
    let screenNames=[
    {
      key:'trip',
      name: 'Job'
    },
    {
      key:'triptimesheet',
      name: 'Job TimeSheet'
    },
    {
      key:'quotation',
      name: 'Quotation'
    },
    {
      key:'workorder',
      name: 'Sales Order'
    }
  ]
  let screenName;
    screenName= screenNames.find(item => item.key==key);
    if(screenName)
    this.screenname= screenName.name
  }
}
