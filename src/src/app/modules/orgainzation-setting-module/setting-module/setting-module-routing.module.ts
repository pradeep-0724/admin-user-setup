import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferencesCustomfiledComponent } from './preferences-customfiled.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
const prefix = getPrefix();
const routes: Routes = [{
  path:'',

  component: PreferencesCustomfiledComponent,
  canActivateChild:[NgxPermissionsGuard],
  children: [
    {
      path: 'vehicle-inspection',
      loadChildren: () => import('./vehicle-inspection-module/vehicle-inspection-module.module').then(m => m.VehicleInspectionModuleModule),
      data: {
        permissions: {
          only:'super_user',
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'inspection-forms',
      loadChildren: () => import('./inspection-form-settings/inspection-form-settings.module').then(m => m.InspectionFormSettingsModule),
      data: {
        permissions: {
          only:'super_user',
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'lorry-hire-challan',
      loadChildren: () => import('./lorry-hire-challan-setting-module/lorry-hire-challan-setting-module.module').then(m => m.LorryHireChallanSettingModuleModule),
      data: {
        permissions: {
          only:Permission.lorry_challan.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'company-trip/custom-field'
        }
      },
    },
    {
      path: 'billofsupply',
      loadChildren: () => import('./bill-of-supply-setting-module/bill-of-supply-setting-module.module').then(m => m.BillOfSupplySettingModuleModule),
      data: {
        permissions: {
          only:Permission.bos.toString().split(','),
        redirectTo: prefix + '/organization_setting/settings/' + 'payment-settlement/prefrence'
        }
      },
    },
    {
      path: 'vehicle-booking',
      loadChildren: () => import('./vehicle-bookings-module/vehicle-bookings-module.module').then(m => m.VehicleBookingsModuleModule),
      data: {
        permissions: {
          only:Permission.vehicle_booking.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'work-order/prefrence'
        }
      },
    },
    {
      path: 'consignment-note',
      loadChildren: () => import('./consignment-note-setting-module/consignment-note-setting-module.module').then(m => m.ConsignmentNoteSettingModuleModule),
      data: {
        permissions: {
          only:Permission.consignment_note.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'lorry-hire-challan/prefrence'
        }
      },
    },
    {
      path: 'invoice',
      loadChildren: () => import('./invoice-setting-module/invoice-setting-module.module').then(m => m.InvoiceSettingModuleModule),
      data: {
        permissions: {
          only:Permission.invoice.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'debit-note/prefrence'
        }
      },
    },
    {
      path: 'preforma-invoice',
      loadChildren: () => import('./preforma-invoice-module/preforma-invoice-module.module').then(m => m.PreformaInvoiceModuleModule),
      data: {
        permissions: {
          only:Permission.invoice.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'debit-note/prefrence'
        }
      },
    },
    {
      path: 'debit-note',
      loadChildren: () => import('./debit-note-setting-module/debit-note-setting-module.module').then(m => m.DebitNoteSettingModuleModule),
      data: {
        permissions: {
          only:Permission.debit_note.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'credit-note/prefrence'
        }
      },
    },
    {
      path: 'credit-note',
      loadChildren: () => import('./credit-note-setting-module/credit-note-setting-module.module').then(m => m.CreditNoteSettingModuleModule),
      data: {
        permissions: {
          only:Permission.credit_note.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'billofsupply/prefrence'
        }
      },
    },
    {
      path: 'bank-activity',
      loadChildren: () => import('./bank-activity-setting-module/bank-activity-setting-module.module').then(m => m.BankActivitySettingModuleModule),
      data: {
        permissions: {
          only:'bank_activity__view',
          redirectTo: prefix + '/organization_setting/settings/' + 'purchase-order/prefrence'
        }
      },
    },
    {
      path: 'journal-entry',
      loadChildren: () => import('./journal-entry-setting-module/journal-entry-setting-module.module').then(m => m.JournalEntrySettingModuleModule),
      data: {
        permissions: {
          only: 'journal_entry__view',
          redirectTo: prefix + '/organization_setting/settings/' + 'bank-activity/prefrence'
        }
      },
    },
    {
      path: 'payment-advance',
      loadChildren: () => import('./payment-advance-setting-module/payment-advance-setting-module.module').then(m => m.PaymentAdvanceSettingModuleModule),
      data: {
        permissions: {
          only:Permission.payments__advance.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'payment-refund/prefrence'
        }
      },
    },
    {
      path: 'payment-refund',
      loadChildren: () => import('./payment-refund-setting-module/payment-refund-setting-module.module').then(m => m.PaymentRefundSettingModuleModule),
      data: {
        permissions: {
          only:Permission.payments__refund.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'journal-entry/prefrence'
        }
      },
    },
    {
      path: 'payment-settlement',
      loadChildren: () => import('./payment-settlement-setting-module/payment-settlement-setting-module.module').then(m => m.PaymentSettlementSettingModuleModule),
      data: {
        permissions: {
          only:Permission.payments__settlement.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'payment-advance/prefrence'
        }
      },
    },
    {
      path: 'company-trip',
      loadChildren: () => import('./company-trip-module/company-trip-module.module').then(m => m.CompanyTripModuleModule),
      data: {
        permissions: {
          only:Permission.trip__new_trip.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'transporter-trip/custom-field'
        }
      },
    },
    {
      path: 'transporter-trip',
      loadChildren: () => import('./transporter-trip-settings-module/transporter-trip-settings-module.module').then(m => m.TransporterTripSettingsModuleModule),
      data: {
        permissions: {
          only:Permission.transporter.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'vehicle-trip/prefrence'
        }
      },
    },
    {
      path: 'vehicle-trip',
      loadChildren: () => import('./vehicle-trip-module/vehicle-trip-module.module').then(m => m.VehicleTripModuleModule),
      data: {
        permissions: {
          only:Permission.trip__new_trip.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'work-order',
      loadChildren: () => import('./work-order-setting-module/work-order-setting-module.module').then(m => m.WorkOrderSettingModule),
      data: {
        permissions: {
          only:Permission.workorder.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'quotation/prefrence'
        }
      },
    },
    {
      path: 'purchase-order',
      loadChildren: () => import('./purchase-order-settings-module/purchase-order-settings-module.module').then(m => m.PurchaseOrderSettingsModuleModule),
      data: {
        permissions: {
          only:Permission.purchase_order.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'vehicle-provider/prefrence'
        }
      },
    },
    {
      path: 'local-purchase-order',
      loadChildren: () => import('./local-purchase-order-setting-module/local-purchase-order-setting-module.module').then(m => m.LocalPurchaseOrderSettingModuleModule),
      data: {
        permissions: {
          only:Permission.localPurchaseOrder.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'vehicle-provider/prefrence'
        }
      },
    },
    {
      path: 'vehicle-provider',
      loadChildren: () => import('./vehicle-provider-module/vehicle-provider-module.module').then(m => m.VehicleProviderModuleModule),
      data: {
        permissions: {
          only:Permission.vehicle_provider.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' +'payment-against-bill/prefrence'
        }
      },
    },
    {
      path: 'payment-against-bill',
      loadChildren: () => import('./payement-against-bill-module/payement-against-bill-module.module').then(m => m.PayementAgainstBillModuleModule),
      data: {
        permissions: {
          only:Permission.bill_payment.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' +'payment-vendor-advance/prefrence'
        }
      },
    },
    {
      path: 'payment-vendor-advance',
      loadChildren: () => import('./payment-vendor-advance-setting-module/payment-vendor-advance-setting-module.module').then(m => m.PaymentVendorAdvanceSettingModuleModule),
      data: {
        permissions: {
          only:Permission.vendor_advance.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' +'vehicle-booking/prefrence'
        }
      },
    },
    {
      path: 'online-bilty',
      loadChildren: () => import('./online-bilty-settings/online-bilty-settings.module').then(m => m.OnlineBiltySettingsModule),
      data: {
        permissions: {
          only:Permission.trip__new_trip.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'market-vehicle-slip',
      loadChildren: () => import('./market-vehicle-slip-module/market-vehicle-slip-module.module').then(m => m.MarketVehicleSlipModuleModule),
      data: {
        permissions: {
          only:Permission.trip__new_trip.toString().split(','),
          redirectTo:prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'quotation',
      loadChildren: () => import('./quotation-setting-module/quotation-setting-module.module').then(m => m.QuotationSettingModuleModule),
      data: {
        permissions: {
          only:Permission.quotations.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + '/master/overview'
        }
      },
    },
    {
      path: 'jobcard',
      loadChildren: () => import('./jobcard-setting-module/jobcard-setting-module.module').then(m => m.JobCardSettingModuleModule),
      data: {
        permissions: {
          only:Permission.maintenance.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + '/master/overview'
        }
      },
    },
    {
      path: 'party',
      loadChildren: () => import('./party-setting-module/party-setting-module.module').then(m => m.PartySettingModuleModule),
      data: {
        permissions: {
          only:Permission.party.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'vehicle',
      loadChildren: () => import('./vehicle-settings-module/vehicle-settings-module.module').then(m => m.VehicleSettingsModuleModule),
      data: {
        permissions: {
          only:Permission.party.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'asset',
      loadChildren: () => import('./own-assets-settings/own-assets-settings.module').then(m => m.OwnAssetsSettingsModule),
      data: {
        permissions: {
          only:Permission.assets.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {
      path: 'site-inspection',
      loadChildren: () => import('./site-inspection-module/site-inspection-module.module').then(m => m.SiteInspectionModuleModule),
      data: {
        permissions: {
          only:Permission.party.toString().split(','),
          redirectTo: prefix + '/organization_setting/settings/' + 'invoice/prefrence'
        }
      },
    },
    {

    path:'',
    pathMatch:'full',
    redirectTo:'consignment-note/prefrence',
    data: {
      permissions: {
        only:Permission.consignment_note.toString().split(','),
        redirectTo: prefix+ '/organization_setting/settings/' + 'lorry-hire-challan/prefrence'
      }
    },
    }
  ]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingModuleRoutingModule { }
