export enum Permission {

//new permissions

dashboard='report_dashboard__create'+','+'report_dashboard__edit'+','+'report_dashboard__delete'+','+'report_dashboard__view',
vehicleInspection='vehicle_inspection__create'+','+'vehicle_inspection__edit'+','+'vehicle_inspection__delete'+','+'vehicle_inspection__view',
journalentry='journal_entry__create'+','+'journal_entry__edit'+','+'journal_entry__delete'+','+'journal_entry__view',
bankactivity='bank_activity__create'+','+'bank_activity__edit'+','+'bank_activity__delete'+','+'bank_activity__view',
employee_attendance='employee_attendance__create'+','+'employee_attendance__edit'+','+'employee_attendance__delete'+','+'employee_attendance__view',

//onboading
vehicle='vehicle__create'+','+'vehicle__edit'+','+'vehicle__delete'+','+'vehicle__view',
assets='own_asset__create'+','+'own_asset__edit'+','+'own_asset__delete'+','+'own_asset__view',
item='item__create'+','+'item__edit'+','+'item__delete'+','+'item__view',
market_vehicle='market_vehicle__create'+','+'market_vehicle__edit'+','+'market_vehicle__delete'+','+'market_vehicle__view',
party='party__create'+','+'party__edit'+','+'party__delete'+','+'party__view',
employee='employee__create'+','+'employee__edit'+','+'employee__delete'+','+'employee__view',
bank='bank__create'+','+'bank__edit'+','+'bank__delete'+','+'bank__view',
trip_code='trip_code__create'+','+'trip_code__edit'+','+'trip_code__delete'+','+'trip_code__view',
tyre_master='tyre_master__create'+','+'tyre_master__edit'+','+'tyre_master__delete'+','+'tyre_master__view',
zone='zone__create'+','+'zone__edit'+','+'zone__delete'+','+'zone__view',
rate_card='company_ratecard__create'+','+'company_ratecard__edit'+','+'company_ratecard__delete'+','+'company_ratecard__view',
container='container__create'+','+'container__edit'+','+'container__delete'+','+'container__view',
opening_balance='opening_balance__create'+','+'opening_balance__edit'+','+'opening_balance__delete'+','+'opening_balance__view',
onboading=vehicle+','+party+','+employee+','+bank+','+trip_code+','+tyre_master+','+opening_balance+','+zone+','+market_vehicle+','+assets+','+container,

//trip
quotations='quotation__create'+','+'quotation__edit'+','+'quotation__delete'+','+'quotation__view',
workorder='workorder__create'+','+'workorder__edit'+','+'workorder__delete'+','+'workorder__view',
trip__new_trip = 'trip__create'+','+'trip__edit'+','+'trip__delete'+','+'trip__view',
vehicle_provider='vehicle_provider__create'+','+'vehicle_provider__edit'+','+'vehicle_provider__delete'+','+'vehicle_provider__view',
tripexpense='tripexpense__create'+','+'tripexpense__edit'+','+'tripexpense__delete'+','+'tripexpense__view',
siteInspection='siteinspection__create'+','+'siteinspection__edit'+','+'siteinspection__delete'+','+'siteinspection__view',
localPurchaseOrder='lpo__create'+','+'lpo__edit'+','+'lpo__delete'+','+'lpo__view',
employeeOthers='employee_activity__create'+','+'employee_activity__edit'+','+'employee_activity__delete'+','+'employee_activity__view',
trip=quotations+','+workorder+','+trip__new_trip+','+vehicle_provider+','+tripexpense+','+employeeOthers+','+siteInspection+','+localPurchaseOrder,










// income
invoice='invoice__create'+','+'invoice__edit'+','+'invoice__delete'+','+'invoice__view',
payments__settlement='settlement__create'+','+'settlement__edit'+','+'settlement__delete'+','+'settlement__view',
payments__advance='advance__create'+','+'advance__edit'+ ','+'advance__delete' + ','+'advance__view',
payments__refund='refund__create'+','+'refund__edit'+ ','+'refund__delete' + ','+'refund__view' ,
credit_note='credit_note__create'+','+'credit_note__edit'+','+'credit_note__delete'+','+'credit_note__view',
debit_note='debit_note__create'+','+'debit_note__edit'+','+'debit_note__delete'+','+'debit_note__view',
bos='bos__create'+','+'bos__edit'+','+'bos__delete'+','+'bos__view',
incomePayment=payments__settlement+','+payments__advance+','+payments__refund,
income=invoice+','+credit_note+','+debit_note+','+bos+','+incomePayment,

//expense

maintenance='maintenance__create'+','+'maintenance__edit'+','+'maintenance__delete'+','+'maintenance__view',
fuel='fuel__create'+','+'fuel__edit'+','+'fuel__delete'+','+'fuel__view',
others='others__create'+','+'others__edit'+','+'others__delete'+','+'others__view',
petty_expense='petty_expense__create'+','+'petty_expense__edit'+','+'petty_expense__delete'+','+'petty_expense__view',
employee_salary='employee_activity__create'+','+'employee_activity__edit'+','+'employee_activity__delete'+','+'employee_activity__view',
expense=maintenance+','+fuel+','+others+','+petty_expense+','+employee_salary,


//payments

bill_payment='bill_payment__create'+','+'bill_payment__edit'+','+'bill_payment__delete'+','+'bill_payment__view',
vendor_advance='vendor_advance__create'+','+'vendor_advance__edit'+','+'vendor_advance__delete'+','+'vendor_advance__view',
vendor_credit='vendor_credit__create'+','+'vendor_credit__edit'+','+'vendor_credit__delete'+','+'vendor_credit__view',
payments=bill_payment+','+vendor_advance+','+vendor_credit,

//inventory

purchase_order='purchase_order__create'+','+'purchase_order__edit'+','+'purchase_order__delete'+','+'purchase_order__view',
inventory_new='inventory_new__create'+','+'inventory_new__edit'+','+'inventory_new__delete'+','+'inventory_new__view',
inventory_adjustment='inventory_adjustment__create'+','+'inventory_adjustment__edit'+','+'inventory_adjustment__delete'+','+'inventory_adjustment__view',
inventory=purchase_order+','+inventory_adjustment+','+inventory_new,

vehicle_booking='others__vehicle_booking__edit'+','+'others__vehicle_booking__view'+','+'others__vehicle_booking__create'+','+'others__vehicle_booking__delete',
lorry_challan=vehicle_booking,
consignment_note=vehicle_booking,
transporter=vehicle_booking,


















}


