import { SharedModule } from 'src/app/shared-module/shared.module';
import { CompanyModuleAddModule } from '../../onboarding-module/company-module-add.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationNotificationsComponent } from './organisation-notifications/organisation-notifications.component';
import { OrganisationNotificationsModuleRoutingModule } from './organisation-notifications-module-routing.module';
import { OrganisationNotificationService } from '../../customerapp-module/api-services/orgainzation-setting-module-services/organisation-notifications-service/organisation-notifications-service.service';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { EmailVerificationDialogService } from './email-verification-dialog.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
    declarations: [OrganisationNotificationsComponent, EmailVerificationComponent],
    imports: [
        CommonModule,
        OrganisationNotificationsModuleRoutingModule,
        CompanyModuleAddModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatDialogModule,
        FormsModule,
        NgOtpInputModule,
        SharedModule,
        NgxPermissionsModule.forChild()
    ],
    providers: [OrganisationNotificationService, {
            provide: MatDialogRef,
            useValue: {}
        },
        EmailVerificationDialogService
    ]
})
export class OrganisationNotificationsModuleModule { }
