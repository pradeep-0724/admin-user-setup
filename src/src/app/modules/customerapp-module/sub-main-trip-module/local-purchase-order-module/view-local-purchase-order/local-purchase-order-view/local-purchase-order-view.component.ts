
import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { LpoService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/lpo-services/lpo.service';
import { LpoPdfViewComponent } from '../../lpo-pdf-view/lpo-pdf-view.component';
import { ListWidgetData } from '../../../new-trip-v2/list-module-v2/list-module-v2-interface';

@Component({
  selector: 'app-local-purchase-order-view',
  templateUrl: './local-purchase-order-view.component.html',
  styleUrls: ['./local-purchase-order-view.component.scss']
})
export class LocalPurchaseOrderViewComponent implements OnInit {
  isFormList = false;
  lpoId=''
  lpoView;
  activeDoc=0;
  prefixUrl=getPrefix();
  lpoPermission=Permission.localPurchaseOrder.toString().split(',')[1];
  settingsUrl='revenue/lpo/trip/crane/setting/'
  filterUrl = 'operation/lpo/job/filters/'
  currency_type;
  listQueryParams = {
		next_cursor: '',
		search: '',
		filters: '[]'
	}
  assignedjobs=[]
  assignedjobsHeaders=[]
  isTax:Boolean=true;
  popupInputDataClose = {
		'msg': 'A closed Local Purchase order cannot be reopened again. Are you sure, you want to close the Local Purchase order?',
		'type': 'warning',
		'show': false
	  };
    assignJobLoading = false;

  constructor(private _route:ActivatedRoute, 
    private router:Router,
    private scrollToTop : ScrollToTop,
    private _lpoService:LpoService,
    private _currency:CurrencyService,
    private _tax:TaxService,
    public dialog: Dialog) { }

  ngOnInit(): void {
    this.scrollToTop.scrollToTop();
    this.currency_type=this._currency.getCurrency();
    this.isTax = this._tax.getTax();
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this._route.params.subscribe(parms => {
      if (parms['id']) {
        this.lpoId = parms['id'];
        this.getLpoView()
        this.getAssignedJobs(this.listQueryParams)
      }
    });
  }
  getAssignedJobs(params) {
		this.assignedjobs = [];
    this.assignedjobsHeaders=[];
	this.listQueryParams.next_cursor=''; 
		this._lpoService.getAssignedJobsList(this.lpoId,params).subscribe((data) => {
			this.assignedjobsHeaders =data['result']['column'];
			if (data['result'].trips.length) {    
				this.assignedjobs = data['result']['trips'];
				this.listQueryParams.next_cursor = data['result']['next_cursor']
			}
		});
	}
  onScroll(event) {
		const container = document.querySelector('.custom-table-container');
		if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10)&& !this.assignJobLoading && this.listQueryParams.next_cursor?.length > 0) {
			this.onScrollassignedJobs(this.listQueryParams);
		}
	}
  onScrollassignedJobs(params) {
		this.assignJobLoading = true;
		this._lpoService.getAssignedJobsList(this.lpoId,params).subscribe(data => {
			this.assignedjobs.push(...data['result']['trips']);
			params.next_cursor = data['result']['next_cursor'];
			this.assignJobLoading = false;
		})
	}

  settingsApplied(event: boolean) {
		if (event) {
			this.listQueryParams.next_cursor = '';
			this.getAssignedJobs(this.listQueryParams);
		}
	}
  listWidgetData(widgetData: ListWidgetData) {
		let queryParams = new Object(
			{
				search: widgetData.searchValue,
				filters: JSON.stringify(widgetData.filterKeyData)
			}
		);
    this.listQueryParams={...this.listQueryParams,...queryParams}
		this.getAssignedJobs(this.listQueryParams)
	}
  historyBack() {
    if(this.isFormList){
      history.back();
    }else{
     this.router.navigate([getPrefix()+'/trip/local-purchase-order/list'])
    }

  }

  getLpoView(){
    this._lpoService.getLpoView( this.lpoId).subscribe(resp=>{
      this.lpoView=resp['result']
    })
  }
  lpoClose(event) {
		if (event) {
		  this._lpoService.closeLpo(this.lpoView['id']).subscribe(() => {
			this.getLpoView();
		  })
	
		} else {
		  this.popupInputDataClose['show'] = false;
		}
	
	  }
	  closeLpo() {
		this.popupInputDataClose['show'] = true;
	  }

   changeDocument(i) {
    this.activeDoc = i
  }

  haveUploadField(arr){
   return  arr.some((field)=>field.field_type=='upload'  )
  }

  haveOtherField(arr){
    return  arr.some((field)=>field.field_type!='upload'  )
   }

   openPdf() {
    if (this.lpoId) {
      const dialogRef = this.dialog.open(LpoPdfViewComponent, {
        minWidth: '75%',
        data: {lpoId: this.lpoId},
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        dialogRefSub.unsubscribe()
      });
    }
  }
}
