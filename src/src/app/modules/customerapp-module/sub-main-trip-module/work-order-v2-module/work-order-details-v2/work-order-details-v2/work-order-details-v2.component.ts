import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { WorkOrderV2Service } from '../../../../api-services/trip-module-services/work-order-service/work-order-v2.service';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { EditCustomFieldService } from '../../../new-trip-v2/new-trip-details-v2/edit-custom-fields/edit-custom-field-service';
import { TaxService } from 'src/app/core/services/tax.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
    selector: 'app-work-order-details-v2',
    templateUrl: './work-order-details-v2.component.html',
    styleUrls: ['./work-order-details-v2.component.scss']
})
export class WorkOrderDetailsV2Component implements OnInit, OnDestroy {
    constructor(private currency:CurrencyService,private _tax:TaxService,private _analytics: AnalyticsService, private commonloaderservice: CommonLoaderService, private _route: ActivatedRoute, private _workOrderV2Service: WorkOrderV2Service, private _workOrderV2DataService: WorkOrderV2DataService, private _editCustomFieldService: EditCustomFieldService) { }
    workOrderDetails: Subject<any> = new Subject();
    workOrderId: string = '';
    customFieldUrl: string = '';
    analyticsScreen = ScreenConstants;
    screenType = ScreenType;
    analyticsType = OperationConstants;
    customFields = [];
    isTax=false;
    currency_type;
    workOrderDocuments = [];
    
    ngOnInit(): void {
        this.isTax=this._tax.getTax();
        this.currency_type = this.currency.getCurrency();

        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.WORKORDER, this.screenType.VIEW, "Navigated");
        this.commonloaderservice.getHide();
        combineLatest([
            this._route.params,
            this._route.queryParams
        ]).subscribe(([params, queryParams]) => {
            if (queryParams['viewId']) {
                this.workOrderId = queryParams['viewId']
            } else {
                this.workOrderId = params['work-order-id']
            }
            this.getWorkOrderDetails()
            this.getworkOrderDocuments();
            this.customFieldUrl = TSAPIRoutes.revenue + TSAPIRoutes.workorder + "customfield/" + this.workOrderId + "/"
            this.workOrderDetails.next(null)
        });
        this._workOrderV2DataService.updateWorkOrderDetails.subscribe(isUpdate => {
            if (isUpdate)
                this.getWorkOrderDetails()
        });
        this.getCustomFields()
    }
    getCustomFields() {
        this._editCustomFieldService.getTripCustomFields(this.customFieldUrl).subscribe(resp => {
            this.customFields = resp['result']['fields']

        })
    }

    ngOnDestroy(): void {
        this.commonloaderservice.getShow();
    }

    getWorkOrderDetails() {
        this._workOrderV2Service.getWorkOrderDetails(this.workOrderId).subscribe(resp => {
            this.workOrderDetails.next(resp['result'])
        })
    }

    fileUploader(e) {        
        let documents = [];
        e.forEach(element => {
            documents.push(element.id);
            element['presigned_url'] = element['url']
            this.workOrderDocuments.push(element)
        });
        let payload = {
            documents: documents
        }
        this._workOrderV2Service.uploadSODocument(this.workOrderId, payload).subscribe(resp => {
        });
    }

    getworkOrderDocuments() {
        this._workOrderV2Service.getUploadedSODocuments(this.workOrderId).subscribe(resp => {
            this.workOrderDocuments = resp['result']['doc'];
        });
    }

    fileDeleted(id) {
        this.workOrderDocuments = this.workOrderDocuments.filter(doc => doc.id != id);
        this._workOrderV2Service.deleteUploadedSODocuments(id).subscribe(resp => {
        });
    }

}
