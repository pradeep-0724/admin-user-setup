import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewQuotationModuleRoutingModule } from './list-view-quotation-module-routing.module';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';
import { ChangeQuotationStatus, QuotationListComponent } from './quotation-list/quotation-list.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { QuotationSearchPipe } from './quotation.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuotationService } from '../../../api-services/trip-module-services/quotation-service/quotation-service';
import { AddEmailPopupModule } from '../../../add-email-popup-module/add-email-popup-module.module';
import { CommentModule } from 'src/app/shared-module/components/comment/comment.module';

@NgModule({
    declarations: [QuotationViewComponent, QuotationListComponent, QuotationSearchPipe, ChangeQuotationStatus],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        NgxPermissionsModule.forChild(),
        NgxPaginationModule,
        BsDatepickerModule.forRoot(),
        MatDialogModule,
        MatSelectModule,
        MatIconModule,
        MatTableModule,
        PdfViewerModule,
        AddEmailPopupModule,
        ListViewQuotationModuleRoutingModule,
        MatCheckboxModule,
        CommentModule
    ],
    providers:[QuotationService ]
})
export class ListViewQuotationModule{ }
