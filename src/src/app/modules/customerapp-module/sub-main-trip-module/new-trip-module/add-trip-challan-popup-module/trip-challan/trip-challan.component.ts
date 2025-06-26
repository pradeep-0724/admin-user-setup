import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { DocumentService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/document.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';

@Component({
  selector: 'app-trip-challan',
  templateUrl: './trip-challan.component.html',
  styleUrls: ['./trip-challan.component.scss']
})
export class TripChallanComponent implements OnInit {
  terminology :any;
  search: any;
  challanListForm: UntypedFormGroup;
  challanList: any = [];
  defaultchallanList:any=[];
  showModal: Boolean = false;
  selectedChallans: any = [];
  isFilterApplied =false;
  p=1;
  
  @Input()  isAdd:boolean;
  @Input() showManageDiscription =true
  @Input() openDescription?:Observable<boolean>
  @Input() openManageDescription?:Observable<boolean>
  @Input() showDocument=false;
  @Output() onAddChallanClicked = new EventEmitter<any>();
  @Output() onAddChallanClickedForLooseCargo = new EventEmitter<any>();
  @Output() onAddChallanClickedForContainer = new EventEmitter<any>();

  @Output() selectedDocuments = new EventEmitter<any>();
  @Output() onAddChallanClickedAdvanceAmount = new EventEmitter<any>();
  @Output() checkChallanExist = new EventEmitter<any>();
  @Output() checkChallanExistForLooseCargo = new EventEmitter<any>();
  @Output() checkChallanExistForContainer = new EventEmitter<any>();

  @Input() alreadySelectedTripChallans = [];
  @Input() inlineAdd: Boolean = false;
  @Input() challanErrorMessage: string = '';
  @Input() tripId :string = '';
  @Input() pulloutAndDepositTripId =[];
  @Input() isFleetExpenseScreen: Boolean = false;
  @Input() isfuelExpenseScreen: Boolean = false;
  @Input () selectedTripDoc?:Observable<[]>;
  @Input () selectedTripDocForCargo?:Observable<[]>;
  @Input () selectedTripDocForContainer?:Observable<[]>;

  @Input() paramsCategory = '';
  @Input() isTripChallanListForCargo : boolean = false;
  copyOFAlreadySelectedChallans=[];
  subscription: Subscription;
  allData: any = [];
  showFilter: boolean = false;
  count :number=0;
  options: any = {
    columns: [
      {
        title: 'Sales Order No.',
        key: 'work_order_no',
        type: 'unique'
      },
     
      {
        title: 'Start',
        key: 'from_loc',
        type: 'unique'
      },
      {
        title: 'Vehicle',
        key: 'vehicle',
        type: 'unique'
      },
      {
        title: 'End',
        key: 'to_loc',
        type: 'unique'
      },
      {
        title: 'Job',
        key: 'trip_id',
        type: 'unique'
      },

    ]
  };
  documentNameList=[];
  selectedDocument=[];
  docToolTip={
    content:["<p>Please select the different document category you want to attach to the invoice and we will automatically attach the uploaded files from all the selected jobs to the Invoice</p>"]
  }
  constructor(
    private _terminologiesService:TerminologiesService,
    private _fb: UntypedFormBuilder,
    private _revenueServices: RevenueService,
    private _popupBodyScrollService:popupOverflowService,
    private _documentsService:DocumentService
  ) {}

  ngOnInit() {
    this.terminology = this._terminologiesService.terminologie;
    this.buildForm();
    this.getFileNameList();
    this.subscription = this._revenueServices.getPartyId().subscribe(resp => {
      this.checkChallanExist.emit(false);
      this.checkChallanExistForLooseCargo.emit(false);
      this.checkChallanExistForContainer.emit(false);
      const partyId = resp["partyId"];
      if (this.isFleetExpenseScreen || this.isTripChallanListForCargo) {        
        if(this.isFleetExpenseScreen){                    
          this._revenueServices.getFLTripChallanListByParty(partyId).subscribe((response) => {
            this.resetChallans();
            this.buildChallans(response.result);
            this.challanErrorMessage = ''
            if (this.challanList.length > 0){
              this.checkChallanExist.emit(true);
            }
          });
        }
        if(this.isTripChallanListForCargo) {
          setTimeout(() => {
            this._revenueServices.getTripChallanListByVendorForCargo(partyId,this.paramsCategory).subscribe((response) => {
              this.resetChallans();
              this.buildChallans(response.result);
              this.challanErrorMessage = ''
              if (this.challanList.length > 0){
                if(this.paramsCategory === 'cargo'){
                  this.checkChallanExistForLooseCargo.emit(true);
                } if(this.paramsCategory === 'container'){
                  this.checkChallanExistForContainer.emit(true);
                }
              }
            });
          }, 800);
        }
      }else{
        this._revenueServices.getTripChallanListByParty(partyId,this.paramsCategory).subscribe((response) => {
          this.resetChallans();
          this.buildChallans(response.result);
          this.challanErrorMessage = ''
          if (this.challanList.length > 0){
            if(this.paramsCategory === 'cargo'){
              this.checkChallanExistForLooseCargo.emit(true);
            }else if(this.paramsCategory === 'container'){
              this.checkChallanExistForContainer.emit(true);
            }else{
              this.checkChallanExist.emit(true);
            }
          }
        });
      }
      
    });

    if(this.selectedTripDoc){
      this.selectedTripDoc.subscribe(doclist=>{        
        if(doclist.length){
          this.documentNameList.forEach(doc=>{
            doclist.forEach(selectedDoc=>{
              if(doc.document_name==selectedDoc){
                doc.selected=true
              }
            })
          })
          this.buildDocuments(this.documentNameList)
        }
      });
    }
    if(this.selectedTripDocForCargo){
      this.selectedTripDocForCargo.subscribe(doclist=>{        
        if(doclist.length){
          this.documentNameList.forEach(doc=>{
            doclist.forEach(selectedDoc=>{
              if(doc.document_name==selectedDoc){
                doc.selected=true
              }
            })
          })
          this.buildDocuments(this.documentNameList)
        }
      });
    }
    if(this.selectedTripDocForContainer){
      this.selectedTripDocForContainer.subscribe(doclist=>{        
        if(doclist.length){
          this.documentNameList.forEach(doc=>{
            doclist.forEach(selectedDoc=>{
              if(doc.document_name==selectedDoc){
                doc.selected=true
              }
            })
          })
          this.buildDocuments(this.documentNameList)
        }
      });
    }

    if(this.openDescription){
      this.openDescription.subscribe(isOpen=>{
        if(isOpen && !this.inlineAdd ){
          this.toggleChallanModal()
          const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
          challans.controls.forEach(challan=>{
            challan.get('selectedChallan').setValue(false)
          });
          this.challanListForm.get('selectedAll').setValue(false)
          const document = this.challanListForm.controls['documents'] as UntypedFormArray;
          document.controls.forEach(doc=>{
            doc.get('selected').setValue(false)
          });
        }
      })
    }

    if(this.openManageDescription){
      this.openManageDescription.subscribe(isOpen=>{
        if(isOpen && this.inlineAdd && this.challanList.length>0){
          this.mapSelectedChallans()
        }
      })
    }
  }

  ngOnChanges(){
    this.copyOFAlreadySelectedChallans=this.alreadySelectedTripChallans;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildForm() {
    this.challanListForm = this._fb.group({
      selectedAll: [false],
      challans: this._fb.array([]),
      documents: this._fb.array([])
    });
  }

  popupOverflowHide(){
    this._popupBodyScrollService.popupHide();
   }

  toggleChallanModal() {
    if (this.challanList.length != 0) {
      this.showModal = true;
      this._popupBodyScrollService.popupActive()

    } else {
      this.challanErrorMessage = 'No Description found. please check party'
      this.showModal = false;
      this._popupBodyScrollService.popupHide()
    }
  }

  resetChallans() {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls = [];
    challans.setValue([]);
    this.challanList = [];
    this.allData = [];
    this.selectedChallans = [];
  }


  buildChallans(items: any = []) {
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls=[];
    challans.updateValueAndValidity();
    items.forEach((groupedChallan: any) => {
      const groupChallanId: string | null = groupedChallan.trip || null;
      if (
        this.tripId !== groupedChallan.trip  && !this.pulloutAndDepositTripId.includes(groupChallanId)
      ) {
        const newChallan = this.addChallanForm(groupedChallan);
        challans.push(newChallan);
        this.challanList.push(groupedChallan);
        this.allData.push(groupedChallan);
      }
    });
    this.alreadySelectedTripChallans.forEach((groupedChallan) => {
      challans.push(this.addChallanForm(groupedChallan));
      this.challanList.push(groupedChallan);
      this.allData.push(groupedChallan);
    });
    this.defaultchallanList =this.challanList;
  }

  buildDocuments(items: any = []) {
    const document = this.challanListForm.controls['documents'] as UntypedFormArray;
    document.controls =[];
    items.forEach((documentName) => {
      document.push(this.addDocument(documentName));
    });
    
  }

  addChallanForm(item) {
    return this._fb.group({
      selectedChallan: [false],
      challanNumber: [item.trip || '', Validators.required]
    });
  }

  addDocument(item){
    return this._fb.group({
      document_name: [item.document_name||''],
      selected: [item.selected],
    });
  }


  onChallanSelected(ele) {
    if (ele.target.checked) {
      let challanItem = this.getItemById(ele.target.value, this.challanList);
      challanItem.total_amount = challanItem.freights + challanItem.charges - challanItem.deductions;
      this.selectedChallans.push(challanItem);

     if(this.isAdd){
       this.count++;
       this.allSelected();
     }
    }
    else {
      this.removeFromSelectedChallans(ele.target.value);
      if(this.isAdd){
        this.allSelected();
      }
    }
  }

  removeFromSelectedChallans(challanNumber) {
    if(this.isAdd){
      this.count--;
    }
    this.selectedChallans = this.selectedChallans.filter((challan) => challan.trip ? challan.trip !== challanNumber : challan.trip !== challanNumber);
    this.alreadySelectedTripChallans = this.alreadySelectedTripChallans.filter((challan) => challan.trip ? challan.trip !== challanNumber : challan.trip !== challanNumber);
  }

  calculateAdvanceAmount(items: any){
    let advance = 0
    items.forEach((challan) => {
        advance += challan.advance;
    });
    return advance
  }

  selectChallans() {
    let form =this.challanListForm
    let advance_amount = this.calculateAdvanceAmount(this.selectedChallans);
    this.selectedDocument = form.value['documents'].filter(doc=>doc.selected==true).map(doc=>doc.document_name)
    let selectedChallans=[];
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls.forEach(challan=>{
      if(challan.get('selectedChallan').value){
        const challanobj = this.challanList.find(challanval=>challanval.trip==challan.get('challanNumber').value)
        if(challanobj)
        selectedChallans.push(challanobj)
      }
    })
    this.selectedChallans=selectedChallans;
    if(this.paramsCategory === 'cargo'){
      this.onAddChallanClickedForLooseCargo.emit(this.selectedChallans);
    }else if(this.paramsCategory === 'container'){
      this.onAddChallanClickedForContainer.emit(this.selectedChallans);
    }else{
      this.onAddChallanClicked.emit(this.selectedChallans);
    }
    this.selectedDocuments.emit(this.selectedDocument)
    this.onAddChallanClickedAdvanceAmount.emit(advance_amount);
    this.showModal = !this.showModal;
  }

  manageChallan() {
    let form =this.challanListForm
    let result = [];

    for (let k = 0; k < this.alreadySelectedTripChallans.length; k++) {
      this.selectedChallans.push(this.alreadySelectedTripChallans[k]);
    }
    let hash = {};
    for (let i = 0; i < this.selectedChallans.length; i++) {
      if (hash.hasOwnProperty(this.selectedChallans[i].trip)) {
        result.push(this.selectedChallans[i]);
      }
      else {
        hash[this.selectedChallans[i].trip] = this.selectedChallans[i];
      }
    }
    this.selectedDocument = form.value['documents'].filter(doc=>doc.selected==true).map(doc=>doc.document_name);
    let selectedChallans=[];
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    challans.controls.forEach(challan=>{
      if(challan.get('selectedChallan').value){
        const challanobj = this.challanList.find(challanval=>challanval.trip==challan.get('challanNumber').value)
        if(challanobj)
        selectedChallans.push(challanobj)
      }
    })
    this.selectedChallans=selectedChallans;
    this.selectedDocuments.emit(this.selectedDocument)
    // this.onAddChallanClicked.emit(this.selectedChallans);
    if(this.paramsCategory === 'cargo'){
      this.onAddChallanClickedForLooseCargo.emit(this.selectedChallans);
    }else if(this.paramsCategory === 'container'){
      this.onAddChallanClickedForContainer.emit(this.selectedChallans);
    }else{
      this.onAddChallanClicked.emit(this.selectedChallans);
    }
    this.onAddChallanClickedAdvanceAmount.emit(this.calculateAdvanceAmount(Object.values(hash)));
    this.showModal = !this.showModal;
  }

  getItemById(id: String, list: []): any {
    return list.filter((item: any) => item.trip === id)[0];
  }

  mapSelectedChallans() {
    this._popupBodyScrollService.popupActive()
    if(this.isAdd){
      this.count = this.alreadySelectedTripChallans.length;
    }
    if(this.isAdd){
        this.search='';
        this.challanList=this.defaultchallanList;
        this.allSelected();
        this.reAsignFormValues();
    }


      
      if (this.challanList.length != 0) {
        this.showModal = !this.showModal;
        const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
        challans.controls.forEach((challan) => {
          const existingChallans = this.alreadySelectedTripChallans.filter((exsitingChallan) =>
                    exsitingChallan.trip ? exsitingChallan.trip === challan.get('challanNumber').value :
                    exsitingChallan.trip === challan.get('challanNumber').value);
          if (existingChallans.length > 0) {
            challan.get('selectedChallan').setValue(true);
          }else{
            challan.get('selectedChallan').setValue(false);
          }
        });
        const isAllSelected=challans.value.every(item => item.selectedChallan === true)
        this.challanListForm.patchValue(isAllSelected)
      }

    }

  filterApplied(result) {
    if(this.isAdd){
      this.defaultSelectedAll();
    }
    this.challanList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied=result.isFilterApplied;

  }

  selectAllAndClick() {
    this.challanList.forEach((challan) => {
        challan.total_amount = challan.freights + challan.charges - challan.deductions;
        this.selectedChallans.push(challan);
      });
  }

  selectAllChalan() {
    this.selectedChallans = [];
    let isAllSelected = this.challanListForm.controls.selectedAll.value;
    if (isAllSelected) {
      this.selectAllAndClick()
      this.count = this.challanList.length;
      this.checkuncheckAll("check");
    } else {
      this.count = 0;
      for (const Item of this.challanList) {
        this.removeFromSelectedChallans(Item.trip);
      }
      this.checkuncheckAll("uncheck");

    }
  }
  allSelected() {
    if ((this.count == this.challanList.length)) {
      this.challanListForm.patchValue({ "selectedAll": true });
    } else {
      this.challanListForm.patchValue({ "selectedAll": false });
    }
  }
  defaultSelectedAll() {
    this.count = 0;
    this.challanListForm.patchValue({ "selectedAll": false });
    for (const Item of this.challanList) {
      this.removeFromSelectedChallans(Item.trip);
    }
    this.checkuncheckAll("uncheck")

  }

  checkuncheckAll(type) {
    this.count = 0;
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;

    this.reAsignFormValues();

    if (type == "check") {
      for (let index = 0; index < challans.length; index++) {
          challans.controls[index].patchValue({ "selectedChallan": true });
          this.count++;
      }
    } else {
      challans.controls.forEach((challan) => {
        challan.get('selectedChallan').setValue(false);
        this.alreadySelectedTripChallans = [];
      })
    }
  }

  searchitem() {
    if (!this.search) {
      this.challanList = this.defaultchallanList;
    } else {
      if(this.isAdd){
        this.defaultSelectedAll();
      }
      this.challanList = this.defaultchallanList.filter(it => {
        const lr_no = it.lr_no.toLowerCase().includes(this.search.toLowerCase());
        const from_loc = it.from_loc.toLowerCase().includes(this.search.toLowerCase());
        const to_loc = it.to_loc.toLowerCase().includes(this.search.toLowerCase());
        const vehicle = it.vehicle.toLowerCase().includes(this.search.toLowerCase());
        const job = it.trip_id.toLowerCase().includes(this.search.toLowerCase());
        return ( lr_no || to_loc || vehicle||from_loc||job);
      });
    }
  }
  close(){
    this._popupBodyScrollService.popupHide();
     this.showModal = this.showModal ?false:true;
     if(this.isAdd){
       this.alreadySelectedTripChallans=this.copyOFAlreadySelectedChallans;
       this.challanList =this.defaultchallanList;
     }
  }
  reAsignFormValues(){
    const challans = this.challanListForm.controls['challans'] as UntypedFormArray;
    for (let index = 0; index < this.defaultchallanList.length; index++) {
      challans.controls[index].patchValue({ "challanNumber": this.defaultchallanList[index].trip });
    }
  }

  getFileNameList(){
    this._documentsService.getDocumentUniqueList().subscribe(response => {
      this.documentNameList = [];
      response['result'].names.forEach(item=>{
        this.documentNameList.push({
          document_name:item,
          selected: false,
        })
      });
      this.buildDocuments(this.documentNameList)
    });
  }
}
