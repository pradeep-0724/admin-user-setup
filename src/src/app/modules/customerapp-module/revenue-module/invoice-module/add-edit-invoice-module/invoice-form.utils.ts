import { FormBuilder, Validators } from "@angular/forms";
import { ValidationConstants } from "src/app/core/constants/constant";
import { CountryIdService } from "src/app/core/services/countryid.service";
import { TransportValidator } from "src/app/shared-module/components/validators/validators";
import { getCountryCode } from "src/app/shared-module/utilities/countrycode-utils";

export function addOtherItem(item) {
    let _fb: FormBuilder = new FormBuilder();
    let defaultTax = new ValidationConstants().defaultTax;
    const form = _fb.group({
        id: [
            ''
        ],
        item: [
            item.item || null,
        ],
        quantity: [
            item.quantity || 0
        ],
        units: [
            item.units || null
        ],
        unit_cost: [
            item.unit_cost || 0.00
        ],
        amount: [
            item.amount || 0.00
        ],
        tax: [item.tax || defaultTax],
        discount: [
            item.discount || 0.00
        ],
        total_amount: [
            item.total_amount || 0.00
        ]
    });
    return form;
}

export function addTimeSheetItem(item) {
    let _fb: FormBuilder = new FormBuilder();
    const form = _fb.group({
        timesheet_id: [item.timesheet_id || null],
        trip_id: [item.trip_id || ''],
        workorder_no: [item.workorder_no || ''],
        start_date: [item.start_date || ''],
        timesheet_no: [item.timesheet_no || ''],
        date: [item.date || ''],
        end_date: [item.end_date || ''],
        location: [item.location || ''],
        billing_hours: [item.billing_hours || 0.00],
        billing_rate: [item.billing_rate || 0.00],
        billing_amount: [item.billing_amount || 0.00],
        extra_hours: [item.extra_hours || 0.00],
        extra_rate: [item.extra_rate || 0.00],
        extra_amount: [item.extra_amount || 0.00],
        tax_amount: [item.tax_amount || 0.00],
        amount: [item.amount || 0.00],
        vehicle_no: [
            item.vehicle_no || ''
        ],
        amount_before_tax: [
            item.amount_before_tax || 0.00
        ],
        total: [
            item.total || 0.00
        ]
    });
    return form;
}

export function addAdditionalChargeItem(item) {
    let _fb: FormBuilder = new FormBuilder();
    let defaultTax = new ValidationConstants().defaultTax;
    const form = _fb.group({
        charge_id: [item.charge_id || null],
        workorder_no: [item.workorder_no || ''],
        charge_name: [item.charge_name || ''],
        date: [item.date || ''],
        quantity: [
            item.quantity || 0
        ],
        units: [
            item.units || ''
        ],
        unit_cost: [
            item.unit_cost || 0.00
        ],
        amount: [
            item.amount || 0.00
        ],
        location: [item.location || ''],
        amount_before_tax: [item.amount_before_tax || 0.00],
        tax: [item.tax?.id || defaultTax],
        tax_label: [item?.tax?.label || ''],
        discount: [
            item.discount || 0.00
        ],
        total: [
            item.total || 0.00
        ]
    });
    return form;
}

export function  addDeductionsItem(item) {
    let _fb: FormBuilder = new FormBuilder();
    const form = _fb.group({
      charge_id: [item.charge_id || null],
      name: [item.name || ''],
      workorder_no: [item.workorder_no || ''],
      trip_id: [item.trip_id || ''],
      date: [item.date || ''],
      vehicle_no: [
        item.vehicle_no || ''
      ],
      amount: [
        item.amount || ''
      ],
      discount: [
        item.discount || 0.00
      ],
      total: [
        item.total || 0.00
      ]
    });
    return form;
  }

  export function  addChargeItem(item) {
    let _fb: FormBuilder = new FormBuilder();
    let defaultTax = new ValidationConstants().defaultTax;
      const form = _fb.group({
        charge_id: [item.charge_id || null],
        name: [item.name || ''],
        workorder_no: [item.workorder_no || ''],
        trip_id: [item.trip_id || ''],
        date: [item.date || ''],
        vehicle_no: [
          item.vehicle_no || ''
        ],
        amount: [
          item.amount || 0.00
        ],
        unit_cost: [
          item.unit_cost || 0.00
        ],
        amount_before_tax: [item.amount_before_tax || 0.00],
        tax: [item.tax?.id || defaultTax],
        tax_label: [item?.tax?.label || ''],
        discount: [
          item.discount || 0.00
        ],
        total: [
          item.total || 0.00
        ]
      });
      return form;
    }

    export function addInvoiceTripChallan(item) {
      let _fb: FormBuilder = new FormBuilder();
      let defaultTax = new ValidationConstants().defaultTax;
        return _fb.group({
          id: [
            item.id || null
          ],
          work_order_no: [item.work_order_no || ''],
          date: [
            item.date || null
          ],
          vehicle: [
            item.vehicle || null
          ],
          lr_no: [
            item.lr_no || ''
          ],
          dn_date: [
            item.dn_date || null
          ],
          freights: [
            item.freights || 0.00
          ],
          freights_tax: [0.00],
          charges: [
            item.charges || 0.00
          ],
          trip_id: [item.trip_id || '-'],
          charges_wo_tax: [item.charges_wo_tax || 0.00],
          charges_tax: [item.charges_tax || 0.00],
          charges_wt_tax: [item.charges_wt_tax || 0.00],
          deductions_wo_tax: [item.deductions_wo_tax || 0.00],
          deductions_tax: [item.deductions_tax || 0.00],
          deductions_wt_tax: [item.deductions_wt_tax || 0.00],
          advance: [item.advance || 0.00],
          balance: [item.balance || 0.00],
          deductions: [
            item.deductions || 0.00
          ],
          trip: [
            item.trip, [Validators.required]
          ],
          adjustment: [
            item.adjustment || 0.00
          ],
          total_amount: [
            0.00
          ],
          tax_amount: [0.00],
          tax: [item.tax || defaultTax]
        });
      }

      export function getInvoiceForm(countryIdService: CountryIdService){
        let _fb: FormBuilder = new FormBuilder();
        const countryId = countryIdService.getCountryId();
        let defaultTax = new ValidationConstants().defaultTax;
        let invoiceForm = _fb.group({
              party: [
                '',
                Validators.required
              ],
              employee: [
                ''
              ],
              reference_no: '',
              contact_person_name: [''],
              contact_person_no: ['', [TransportValidator.mobileNumberValidator()]],
              country_code: getCountryCode(countryId),
              invoice_number: [
                '',
                Validators.required
              ],
              invoice_date: [
                '',
                Validators.required
              ],
              due_date: [
                null
              ],
              payment_term: [
                null
              ],
              bank_account: [
                null,
              ],
              is_roundoff: [
                false
              ],
              terms_and_condition: [
                null
              ],
              narrations: [''],
              is_transaction_under_reverse: [
                false
              ],
              is_transaction_includes_tax: [
                false
              ],
              place_of_supply: [''],
              signature: [''],
              documents: [[]],
              attached_document_types:_fb.group({
                other: [[]],
                crane: _fb.group({ charge: [[]], deduction: [[]] }),
                awp: _fb.group({ charge: [[]], deduction: [[]] }),
                container: _fb.group({ charge: [[]], deduction: [[]], jobs: [[]] }),
              }),
              performainvoice_id: [null],
              deleted_challans: _fb.array([]),
              deleted_trip_challans: _fb.array([]),
              item_others: _fb.array([]),
              address: _fb.array([
                _fb.group({
                  address_line_1: [
                    ''
                  ],
                  address_type: [
                    ''
                  ],
                  address_type_index: 0,
                  country: [''],
                  document: [],
                  pincode: [
                    null,
                    [TransportValidator.pinCodeValidator, Validators.maxLength(70)]],
                  state: [
                    ''
                  ],
                  street: [
                    ''
                  ]
                }),
                _fb.group({
                  address_line_1: [
                    ''
                  ],
                  address_type: [
                    ''
                  ],
                  address_type_index: 1,
                  country: [''],
                  document: [],
                  pincode: [null, [TransportValidator.pinCodeValidator, Validators.maxLength(70)]],
                  state: [
                    ''
                  ],
                  street: [
                    ''
                  ],
                })
              ]),
              crane: _fb.group({
        
                timesheet_tax: [defaultTax],
                timesheets: _fb.array([]),
                charges: _fb.array([]),
                deductions: _fb.array([]),
                additional_charges: _fb.array([]),
              }),
              awp: _fb.group({
                timesheet_tax: [defaultTax],
                timesheets: _fb.array([]),
                charges: _fb.array([]),
                deductions: _fb.array([]),
                additional_charges: _fb.array([]),
              }),
              container: _fb.group({
                trip_challan_tax: [defaultTax],
                charges: _fb.array([]),
                deductions: _fb.array([]),
                additional_charges: _fb.array([]),
                trip_challan: _fb.array([])
              }),
              others: _fb.group({
                trip_challan: _fb.array([]),
                trip_challan_tax: [defaultTax],
                additional_charges: _fb.array([]),
              }),
              customfields: _fb.array([])
            });

       return invoiceForm
      }