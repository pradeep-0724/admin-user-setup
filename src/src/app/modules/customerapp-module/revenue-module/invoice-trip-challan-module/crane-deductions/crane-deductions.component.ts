import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DocumentService } from '../../../api-services/auth-and-general-services/document.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-crane-deductions',
  templateUrl: './crane-deductions.component.html',
  styleUrls: ['./crane-deductions.component.scss']
})
export class CraneDeductionsComponent implements OnInit {
  search: any;
  deductionsListForm: UntypedFormGroup;
  deductionsList = [];
  defaultDeductionsList:any=[];
  deductionsSelectedList=[];
  allData: any = [];
  showFilter: boolean = false;
  isFilterApplied =false;
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
    content:["<p>Please select the different document category you want to attach to the invoice and we will automatically attach the uploaded files from all the selected trips to the Invoice</p>"]
  };
  selectedTripDoc?:Observable<[]>
  showAdjustment : boolean = false;
  showDocuments : boolean = true;
  currency_type:any;

  constructor(
   private dialogRef: DialogRef<any>, @Inject(DIALOG_DATA)  private data: any,
    private _fb: UntypedFormBuilder,private _documentsService:DocumentService,
    private currency: CurrencyService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.showAdjustment = this.data?.showAdjustment;
    this.showDocuments = this.data?.showDocuments;
    this.buildDeductions(this.data.deductionsList);
    this.getFileNameList()
    this.deductionsSelectedList=this.data.deductionsSelectedList
    if (this.deductionsSelectedList.length) {
      this.markSelectedDeduction()
    }
    
    const document = this.deductionsListForm.controls['documents'] as UntypedFormArray;
    document.controls.forEach(doc=>{
      doc.get('selected').setValue(false)
    });
  }

  buildForm() {
    this.deductionsListForm = this._fb.group({
      selectedAll: [false],
      deductions: this._fb.array([]),
      documents : this._fb.array([])
    });
  }

  
  buildDeductions(items: any = []) {
    const deductions = this.deductionsListForm.controls['deductions'] as UntypedFormArray;
    items.forEach((item) => {
      deductions.push(this.addDeductionsForm(item));
        this.deductionsList.push(item);
        this.allData.push(item);
    });
    this.defaultDeductionsList =this.deductionsList;
  }

  addDeductionsForm(item) {
    return this._fb.group({
      selectedDeductions: [false],
      charge_id: [item.charge_id || '', Validators.required]
    });
  }




  onSelectionDeduction(){
    const deductions = this.deductionsListForm.controls['deductions'] as UntypedFormArray;
    const allSelected= deductions.value.every(item => item.selectedDeductions === true)
    this.deductionsListForm.controls.selectedAll.setValue(allSelected)
  }

  markSelectedDeduction(){
    const deductions = this.deductionsListForm.controls['deductions'] as UntypedFormArray;
    deductions.controls.forEach(form => {
      if (this.deductionsSelectedList.find(charge => charge.charge_id == form.get('charge_id').value)) {
        form.get('selectedDeductions').setValue(true)
      }
    });
    const allSelected = deductions.value.every(item => item.selectedDeductions === true)
    this.deductionsListForm.controls.selectedAll.setValue(allSelected)
  }


  filterApplied(result) {
    this.deductionsList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied=result.isFilterApplied;
  }


  selectAllTimeSheet() {
    let isAllSelected = this.deductionsListForm.controls.selectedAll.value;
    const deductions = this.deductionsListForm.controls['deductions'] as UntypedFormArray;
    deductions.controls.forEach(form=>{
      form.get('selectedDeductions').setValue(isAllSelected)
    });
  }

  searchitem() {
    if (!this.search) {
      this.deductionsList = this.defaultDeductionsList;
    } else {
      this.deductionsList = this.defaultDeductionsList.filter(it => {
        const work_order_no =it.work_order_no? it.work_order_no.toLowerCase().includes(this.search.toLowerCase()):false;
        const date =it.date? it.date.toLowerCase().includes(this.search.toLowerCase()):false;
        const vehicle_no=it.vehicle_no?it.vehicle_no.toLowerCase().includes(this.search.toLowerCase()):false;
        return (work_order_no ||date||vehicle_no);
      });
    }
  }

  selectedDeductions(){
    let selectedDeductions=[];
    let form = this.deductionsListForm;
    const deductions = this.deductionsListForm.controls['deductions'] as UntypedFormArray;
    deductions.controls.forEach(form=>{
      if(form.get('selectedDeductions').value){
      selectedDeductions.push(this.deductionsList.find(deductions=>deductions.charge_id==form.get('charge_id').value) )
      }
    });
    this.selectedDocument = form.value['documents'].filter(doc=>doc.selected==true).map(doc=>doc.document_name)
    let data = {
      selectedCharge : selectedDeductions ,
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
    const document = this.deductionsListForm.controls['documents'] as UntypedFormArray;
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