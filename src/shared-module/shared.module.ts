import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '../modules/customerapp-module/file-uploader-module/file-uploader/file-uploader.component';
import { ErrorComponent } from '../app-error-module/error/error.component';
import { DocumentService } from '../modules/customerapp-module/api-services/auth-and-general-services/document.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceListFilterPipe } from './pipes/advance-payment-search.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { TitleCaseDirective } from './directives/title-case.directive';
import { TitleCasePipe } from '@angular/common';
import { LowerCaseDirective } from './directives/lower-case.directive';
import { UpperCaseDirective } from './directives/upper-case.directive';
import { TwoDigitDecimalNumber } from './directives/two-decimal-places.directive';
import { PositiveTwoDigitDecimalNumber } from './directives/positive-two-decimal-places.directive';
import { PositiveThreeDigitDecimalNumber } from './directives/positive-three-decimal-places.directive';
import { MonthYearComponent } from './components/month-year/month-year.component';
import { MaterialListPipe } from './pipes/material-search.pipe';
import { ThreeDigitDecimalNumber } from './directives/three-decimal-places.directive';
import { MonthNullComponent } from './components/month-null-value/month-null.component';
import { GeneralService } from '../modules/customerapp-module/api-services/auth-and-general-services/general.service';
import { AlertPopupModuleModule } from '../alert-popup-module/alert-popup-module.module';
import { AlertPopupComponent } from '../alert-popup-module/alert-popup/alert-popup.component';
import { AppErrorModuleModule } from '../app-error-module/app-error-module.module';
import { PartyListFilterPipe } from './pipes/party-list-search.pipe';
import { MaterialDropdownComponent } from '../modules/customerapp-module/material-drop-down-module/material-dropdown/material-dropdown.component';
import { MaterialDropDownModule } from '../modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { ListFilterModulePopupModule } from '../modules/customerapp-module/list-filter-module-popup-module/list-filter-module-popup-module.module';
import { FilterComponent } from '../modules/customerapp-module/list-filter-module-popup-module/filter/filter.component';
import { FileUploaderModule } from '../modules/customerapp-module/file-uploader-module/file-uploader-module.module';
import { MatInputModule } from '@angular/material/input';
import { PositiveDigitNumber } from './directives/positive-number-place.directive';
import { AppDateAdapter } from '../core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RemoveSpacesDirective } from './directives/remove-spaces.directive';
import { NumberFormatPipe } from './pipes/numberformat.pipe';



@NgModule({
    declarations: [
        AdvanceListFilterPipe,
        TitleCaseDirective,
        LowerCaseDirective,
        UpperCaseDirective,
        TwoDigitDecimalNumber,
        ThreeDigitDecimalNumber,
        PositiveTwoDigitDecimalNumber,
        PositiveThreeDigitDecimalNumber,
        MonthYearComponent,
        MaterialListPipe,
        MonthNullComponent,
        PartyListFilterPipe,
        PositiveDigitNumber,
        RemoveSpacesDirective,
        NumberFormatPipe

    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        AlertPopupModuleModule,
        AppErrorModuleModule,
        ListFilterModulePopupModule,
        MatInputModule,
        FileUploaderModule,
        MatMomentDateModule,
        MaterialDropDownModule
    ],
    exports: [
        FileUploaderComponent,
        ErrorComponent,
        AdvanceListFilterPipe,
        AlertPopupComponent,
        TitleCaseDirective,
        LowerCaseDirective,
        UpperCaseDirective,
        MaterialDropdownComponent,
        TwoDigitDecimalNumber,
        ThreeDigitDecimalNumber,
        PositiveTwoDigitDecimalNumber,
        PositiveDigitNumber,
        PositiveThreeDigitDecimalNumber,
        MonthYearComponent,
        MaterialListPipe,
        MonthNullComponent,
        FilterComponent,
        PartyListFilterPipe,
        RemoveSpacesDirective,
        NumberFormatPipe
    ],
    providers: [
        DocumentService, TitleCasePipe, GeneralService,{ provide: DateAdapter, useClass: AppDateAdapter }
    ]
})
export class SharedModule { }
