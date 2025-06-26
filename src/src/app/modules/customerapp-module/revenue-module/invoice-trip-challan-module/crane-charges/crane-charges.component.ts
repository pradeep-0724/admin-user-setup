import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../../../api-services/auth-and-general-services/document.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-crane-charges',
  templateUrl: './crane-charges.component.html',
  styleUrls: ['./crane-charges.component.scss']
})
export class CraneChargesComponent implements OnInit {
  search: any;
  chargesListForm: UntypedFormGroup;
  chargesList = [];
  defaultChargesList:any=[];
  allData: any = [];
  showFilter: boolean = false;
  isFilterApplied =false;
  selectedChargeList=[]
  showAdjustment : boolean = false;
  showDocuments : boolean = true;

  options: any = {
    columns: [
      {
        title: 'SO NO.',
        key: 'workorder_no',
        type: 'unique'
      },
      {
        title: 'Job No',
        key: 'trip_id',
        type: 'unique'
      },
      {
        title: 'Vehicle No',
        key: 'vehicle_no',
        type: 'unique'
      }
    ]
  };
  documentNameList=[];
  selectedDocument=[];
  docToolTip={
    content:["<p>Please select the different document category you want to attach to the invoice and we will automatically attach the uploaded files from all the selected jobs to the Invoice</p>"]
  };
  currency_type:any;

  constructor(
   private dialogRef: DialogRef<any>, @Inject(DIALOG_DATA)  private data: any,
    private _fb: UntypedFormBuilder,    private _documentsService:DocumentService,private currency: CurrencyService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.buildCharges(this.data.chargesList  );
    this.showAdjustment = this.data?.showAdjustment;
    this.showDocuments = this.data?.showDocuments;
    this.getFileNameList();
    this.selectedChargeList = this.data.chargesSelectedList
    if (this.selectedChargeList.length) {
      this.markSelectedCharges()
    }

  
  }

  buildForm() {
    this.chargesListForm = this._fb.group({
      selectedAll: [false],
      charges: this._fb.array([]),
      documents : this._fb.array([])
    });
  }

  
  buildCharges(items: any = []) {
    const charges = this.chargesListForm.controls['charges'] as UntypedFormArray;
    items.forEach((item) => {
      charges.push(this.addChargesForm(item));
        this.chargesList.push(item);
        this.allData.push(item);
    });
    this.defaultChargesList =this.chargesList;
  }

  addChargesForm(item) {
    return this._fb.group({
      selectedCharge: [false],
      charge_id: [item.charge_id || '', Validators.required]
    });
  }




  onSelectionCharge(){
    const charges = this.chargesListForm.controls['charges'] as UntypedFormArray;
    const allSelected= charges.value.every(item => item.selectedCharge === true)
    this.chargesListForm.controls.selectedAll.setValue(allSelected)
  }

  markSelectedCharges() {
    const additional_charges = this.chargesListForm.controls['charges'] as UntypedFormArray;
    additional_charges.controls.forEach(form => {
      if (this.selectedChargeList.find(charge => charge.charge_id == form.get('charge_id').value)) {
        form.get('selectedCharge').setValue(true)
      }
    });
    const allSelected = additional_charges.value.every(item => item.selectedCharge === true)
    this.chargesListForm.controls.selectedAll.setValue(allSelected)
  }


  filterApplied(result) {
    this.chargesList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied=result.isFilterApplied;
  }


  selectAllTimeSheet() {
    let isAllSelected = this.chargesListForm.controls.selectedAll.value;
    const charges = this.chargesListForm.controls['charges'] as UntypedFormArray;
    charges.controls.forEach(form=>{
      form.get('selectedCharge').setValue(isAllSelected)
    });
  }

  searchitem() {
    if (!this.search) {
      this.chargesList = this.defaultChargesList;
    } else {
      this.chargesList = this.defaultChargesList.filter(it => {
        const work_order_no =it.work_order_no? it.work_order_no.toLowerCase().includes(this.search.toLowerCase()):false;
        const date =it.date? it.date.toLowerCase().includes(this.search.toLowerCase()):false;
        const vehicle_no=it.vehicle_no?it.vehicle_no.toLowerCase().includes(this.search.toLowerCase()):false;
        return (work_order_no ||date||vehicle_no);
      });
    }
  }

  selectedCharge(){
    let selectedCharge=[];
    let form = this.chargesListForm;
    const charges = this.chargesListForm.controls['charges'] as UntypedFormArray;
    this.selectedDocument = form.value['documents'].filter(doc=>doc.selected==true).map(doc=>doc.document_name)
    charges.controls.forEach(form=>{
      if(form.get('selectedCharge').value){
      selectedCharge.push(this.chargesList.find(charge=>charge.charge_id==form.get('charge_id').value) )
      }
    });
    let data = {
      selectedCharge : selectedCharge ,
      selectedDocument : this.selectedDocument
    }
   this.dialogRef.close(data)
  }

  close(){
    this.dialogRef.close('close')
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
      this.buildDocuments(this.documentNameList);
      if(this.data?.selectedDocs){
        if(this.data?.selectedDocs?.length>0){  
          this.documentNameList.forEach(doc=>{
            this.data?.selectedDocs.forEach(selectedDoc=>{
              if(doc.document_name==selectedDoc){
                doc.selected=true
              }
            })
          })
          this.buildDocuments(this.documentNameList)
        }
      }
    });
  }

  buildDocuments(items: any = []) {
    const document = this.chargesListForm.controls['documents'] as UntypedFormArray;
    document.controls =[];
    items.forEach((documentName) => {
      document.push(this.addDocument(documentName));
    });
  }
  addDocument(item){
    return this._fb.group({
      document_name: [item.document_name||''],
      selected: [item.selected],
    });
  }


}