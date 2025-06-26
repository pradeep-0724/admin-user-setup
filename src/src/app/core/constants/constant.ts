export enum AppConstants {
	DATE_FORMAT = 'dd-MM-yyyy'
}
export class ValidationConstants {
	VALIDATION_PATTERN = {
    	CO_ORDINATES:/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/,
		EMAIL_PHONE_NUMBER: /^(?:\d{10}|\w+[._]?\w+[._]?\w+?@\w+\.\w{1,3}[.]?\w+?)$/,
		EMAIL: /^(\w+[._]?\w+[._]?\w+?@\w+\.\w{1,3}[.]?\w+?)$/,
		PHONE_NUMBER: /^(\d{10})$/,
		PHONE_NUMBER_NULL_10: /^(\d{0,10})$/,
		PIN_CODE: /^(\d{6})$/,
		WEBSITE: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
		GSTIN: /^(3[0-7]|[1-2][0-9]|0[1-9])[A-Z]{3}[CPHFATBLJGE]{1}[A-Z]{1}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/,
		NUMBER_ONLY: /^[0-9]*$/,
		FLOAT: /^([0-9]*[.])?[0-9]+$/,
		//REG_NO: /^\s*[a-zA-Z\b]{2}\s?[0-9]{1,2}\s?[a-zA-Z\b]{1,2}\s?[0-9]{1,4}$/,
		REG_NO: /^[a-zA-Z\b]{2}[-][0-9a-zA-Z\b]{2}(?:-[a-zA-Z\b])?(?:-[a-zA-Z\b]{2,3})?-[0-9\b]{4}$/,
		IFSC: /^[A-Za-z0-9]{11}$/,
		PERCENTAGE: /^[0-9][0-9]?$|^100$/,
		ODOMETER: /^\d{0,6}(\.\d{1,3})?$/g,
		ALPHA_NUMERIC: /^[A-Z0-9]+$/,
		ALPHA_NUMERIC2: /^[a-zA-Z0-9]+$/,
		ALPHABET: /^[a-zA-Z]+$/,
		USERNAME: /^[a-z0-9]{4,20}$/,
		PAN_VALIDATION: /^[A-Z]{3}[CPHFATBLJGE]{1}[A-Z]{1}\d{4}[A-Z]{1}$/,
		POLICY_NUMBER: /^[ A-Za-z0-9#/\\,.;:\|\-_()]*$/,
		ACCOUNT_HOLDER_NAME: /^[a-zA-Z]([\w -]*[a-zA-Z])?$/,
		FOREMAN_MODEL: /^[a-zA-Z]([\w -]*[a-zA-Z0-9 _-])?$/,
		EMAILV2:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		BDPCONTAINERNUMBER: /^([A-Z]{4}\d{7})$/
	};
	defaultTax: any = "b17fd40c-08c3-42de-baa1-7d3bc0180665";
	unregisteredGst = "aa5ce0dc-bf9f-4e01-b7bd-ed58b76d9ac4";
	expense = 'Expense'
	unregisteredLabel = "Unregistered";
	nonTaxableLabel: any = 'Non-Taxable';
	enterValidDetail = 'Please enter valid detail';
	filter: Array<any> = [
		{ key: '5', value: 5 },
		{ key: '10', value: 10 },
		{ key: '15', value: 15 },
		{ key: '20', value: 20 },
		{ key: '25', value: 25 }
	];
	pettyCashId: string = "b36b6217-db0c-4f10-bb3c-f46962314ca4";
	unDepositedFundsId: string = "98073897-7b70-4d62-99ac-e880943e3b8d";
	accountType: Array<any> = ["Cash in Hand", "Bank OCC A/c", "Bank OD A/c", "Bank"];
	credit: string = 'credit';
	debit: string = 'debit';
	bankActivityNoPrefix = 'BN';
	profit = 'PROFIT';
	loss = 'LOSS';
	amount = 'AMOUNT';
	keybankActivity: string = 'bankactivity';
	tyreNumbers: Array<any> = [
		{ key: '4', value: 4 },
		{ key: '6', value: 6 },
		{ key: '8', value: 8 },
		{ key: '10', value: 10 },
		{ key: '12', value: 12 },
		{ key: '14', value: 14 },
		{ key: '16', value: 16 },
		{ key: '18', value: 18 },
		{ key: '20', value: 20 },
		{ key: '22', value: 22 },
		{ key: '24', value: 24 },
		{ key: '26', value: 26 }
	];
  HSN_CODE = 9965;
  EMPLOYEETYPEDRIVERID="0977d648-e861-452f-be0d-1cb58abba5c0";
	paidOption = { 'value': 3, 'label': 'Paid' };
	partiallyPaidOption = { 'value': 2, 'label': 'Partially Paid' };
	unPaidOption = { 'value': 1, 'label': 'Unpaid' };
  payLaterOption = { 'value': 1, 'label': 'Pay Later' };
	discardAvailability = { label: 'Discarded', value: "4f0eb0a4-cad3-4db5-b904-ee838d3c61d9" }
	afterTaxAdjustmentAccountOption = { value: 'b066004d-979d-4dd3-990d-1e2ea527c9fa', label: 'Other Charges (After-tax Adj) A/c' };
	defaultAdjustmentAccountOption = { value: '83f23495-b6c3-4788-ae14-7d075e6cd2e4', label: 'Advertising/ Marketing/ Promotional' }
	paymentChequeIds = {
		cashId: 'e9dc7261-5561-4a41-be9d-e076cff65a45',
		chequeClearedId: "3c19ab46-47c8-4450-b045-0c88c1d8d4db",
		chequeCancelId: "81f8e32b-4656-4e7d-a6ca-c843edda9ac4",
		chequeId: 'cb285348-b60c-41ac-b229-52b041872576',
		chequePostDate: 'a8bad90c-e091-48c3-95b2-811ed51df765',
		checqueUnCleared: '721c08ec-c856-4691-8522-0984f9268f8b'
	}

	routeConstants: any = [
		{ name: 'manualjournalentry', route: '/reports/accountant/journal-entry/edit/', prefix: 'Journal No.' },
		{ name: 'vehicletrip', route: '/trip/new-trip/details/', prefix: '' },
        { name: 'jobcard', route: '/expense/maintenance/view/', prefix: 'JobCard No.' },
		{ name: 'fleetowner', route: '/trip/vehicle-payment/list', prefix: 'Bill No.' },
		{ name: 'billofsupply', route: '/income/billofsupply/list', prefix: 'Bill of Supply No.' },
		{ name: 'fuel', route: '/expense/fuel_expense/list', prefix: 'Bill No.' },
		{ name: 'billpayment', route: '/payments/list/bill', prefix: 'Payment No.' },
		{ name: 'otherexpenseactivity', route: '/expense/others_expense/list', prefix: 'Bill No.' },
		{ name: 'vendorcredit', route: '/payments/vendor_credit/edit/', prefix: 'Vendor Credit No.' },
		{ name: 'paymentmadedetail', route: '/payments/list/advance', prefix: 'Advance No.' },
		{ name: 'bankactivity', route: '/reports/bank-activity/edit/', prefix: 'Bank Activity No.' },
		{ name: 'vendoradvance', route: '/income/payments/list/advance', prefix: 'Payment No.' },
		{ name: 'refundsvoucher', route: '/income/payments/refund/edit/', prefix: 'Refund No.' },
		{ name: 'paymentsettlement', route: '/income/payments/list/invoice', prefix: 'Payment No.' },
		{ name: 'invoice', route: '/income/invoice/view/', prefix: 'Invoice No.' },
		{ name: 'debitnote', route: '/income/debit-note/list', prefix: 'Debit Note No.' },
		{ name: 'creditnote', route: '/income/credit-note/list', prefix: 'Credit Note No.' },
		{ name: 'employeesalary', route: '/expense/salary_expense/list', prefix: 'Employee Salary' },
		{ name: 'employeeotherexpenseactivity', route: '/trip/employee-others/list', prefix: 'Employee Other' },
		{ name: 'pettyexpense', route: '/expense/petty-expense/list', prefix: 'Petty Expense' },
		{ name: 'inventoryactivity', route: '/inventory/list/inventory-new', prefix: 'Bill No.' },
		{ name: 'vehicle', route: '/onboarding/vehicle/', prefix: 'Vehicle'},
		{ name: 'employee', route: '/onboarding/employee/view/', prefix: 'Employee'},
		{ name: 'company', route: '/organization_setting/profile/', prefix: 'Company', addEditId: false },
	    { name: 'tripexpense', route: '/trip/trip-expense/list', prefix: 'Trip Expense' },
		{ name: 'quotation', route: '/trip/quotation/details/', prefix: 'Quotation' },
		{ name: 'workorder', route: '/trip/work-order/details/', prefix: 'Sales Order' },
		{ name: 'asset', route: '/onboarding/assets/view/', prefix: 'Asset' }
	]

	month: any = [{
		id: 1,
		name: 'January'
	},
	{
		id: 2,
		name: 'February'
	},
	{
		id: 3,
		name: 'March'
	},
	{
		id: 4,
		name: 'April'
	},
	{
		id: 5,
		name: 'May'
	}, {
		id: 6,
		name: 'June'
	}, {
		id: 7,
		name: 'July'
	},
	{
		id: 8,
		name: 'August'
	},
	{
		id: 9,
		name: 'September'
	}, {
		id: 10,
		name: 'October'
	}, {
		id: 11,
		name: 'November'
	}, {
		id: 12,
		name: 'Dececember'
	}]

	hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

	minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
		'40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

	paymentTermList = [{
		value: 1,
		label: 'On Trip End date'
	},
	{
		value: 2,
		label: '7 Days after Trip Start Date'
	},
	{
		value: 3,
		label: '15 Days after Trip Start Date'
	},
  {
		value: 7,
		label: '1 Day after trip end date'
	},
	{
		value: 8,
		label: '2 Day after trip end date'
	},
	{
		value: 9,
		label: '3 Day after trip end date'
	},
	{
		value: 4,
		label: '7 Days after Trip End Date'
	},
	{
		value: 5,
		label: '15 Days after Trip End Date'
	},
	{
		value: 6,
		label: 'Custom'
	}
	]

	videoUrls=[
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Revised+-+Add+trip+overview+-+own+vehicle.mp4',
			name:'Add Trip Overview',
			vehicle:'own',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/add+trip+-+till+freight+-+own+vehicle.mp4',
			name:'Add Trip Freight',
			vehicle:'own',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+trip+-+fuel+record+-+own+vehicle.mp4',
			name:'Fuel',
			vehicle:'own',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+trip+-+driver+allowance.mp4',
			name:'Driver Allowance',
			vehicle:'own',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+Trip+-+other+expenses+-+own+vehicle.mp4',
			name:'Other Expense',
			vehicle:'own',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+trip+-+Charges+-+own+vehicle.mp4',
			name:'Charge',
			vehicle:'own',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/add+trip+-+advance+-+own+vehicle.mp4',
			name:'Advance',
			vehicle:'own',
			view:false
		},

		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+Trip+-+MV+-+Overview.mp4',
			name:'Add Trip',
			vehicle:'mvehicle',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/add+trip+-+fuel+-+MV.mp4',
			name:'Fuel',
			vehicle:'mvehicle',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+Trip+-+other+expenses+-+own+vehicle.mp4',
			name:'Other Expense',
			vehicle:'mvehicle',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+Trip+-+Charge+-+MV.mp4',
			name:'Charge',
			vehicle:'mvehicle',
			view:false
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Add+trip+-+Advances+-+MV.mp4',
			name:'Advance',
			vehicle:'mvehicle',
			view:false
		},

		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+complete+-+MV.mp4',
			name:'Completed Status',
			vehicle:'own',
			view:true
		},
		 {
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+POD.mp4',
			name:'PoD Received Status',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+charge+-+own+vehicle.mp4',
			name:'Charge',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+fuel+-+own+vehicle.mp4',
			name:'Fuel',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Uploaded+POD.mp4',
			name:'Upload PoD',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+advance+-+own+vehicle.mp4',
			name:'Advance',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Other+expenses.mp4',
			name:'Other Expense',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+Driver+ledger.mp4',
			name:'Driver Ledger',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+allowance.mp4',
			name:'Driver Allowance',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Bilty.mp4',
			name:'Create Online Bilty',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Bos.mp4',
			name:'Create BoS',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Invoice.mp4',
			name:'Create Invoice',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+upload+documents.mp4',
			name:'Upload Documents',
			vehicle:'own',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+complete+-+MV.mp4',
			name:'Completed Status',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+POD.mp4',
			name:'PoD Received Status',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Charges+-+MV.mp4',
			name:'Charge',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Fuel+-+MV.mp4',
			name:'Fuel',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Uploaded+POD.mp4',
			name:'Upload PoD',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+advance+-+MV.mp4',
			name:'Advance',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Other+expenses.mp4',
			name:'Other Expense',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Bilty.mp4',
			name:'Create Online Bilty',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+MV+slip.mp4',
			name:'Create Market Vehicle Slip',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+MV+Bill.mp4',
			name:'Create Vehicle Provider Bill',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Bos.mp4',
			name:'Create BoS',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/View+screen+-+Invoice.mp4',
			name:'Create Invoice',
			vehicle:'mvehicle',
			view:true
		},
		{
			url:'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/view+screen+-+upload+documents.mp4',
			name:'Upload Documents',
			vehicle:'mvehicle',
			view:true
		},
	]
	paymentTermCustom="394a0453-fc2d-40ff-918f-aeb62201a161"
}


export enum LiveDemoLink{
  Onboarding='https://demo.arcade.software/7f3LvBxHLkcNribeQJo7?embed',
  Trips='https://demo.arcade.software/2RFkGMRIscQAYqbdG2OH?embed',
  Income='https://demo.arcade.software/730ED7gMyX85bcDGbYK9?embed',
  Expense='https://demo.arcade.software/u6WBJwUyXWnuISPyRqmP?embed',
  Payments='',
  Inventory='',
  Reports='https://demo.arcade.software/t9A6KUB0yvcwcJlbucuc?embed',
  Dashboard='https://demo.arcade.software/VOC6TUjWirMMCQ9ihclH?embed'

}

export enum VendorType{
	VehicleProvider='2',
	Othres='0',
	NullVendor=''
}
export enum PartyType{
	Client='0',
	Vendor='1'
}

export class RateCardBillingBasedOn{
	constructor(day: { week: number, day: number, month: number } = { week: 7, day: 1, month: 30 }, hour: { week: number, day: number, month: number } = { week: 60, day: 10, month: 260 }) {
		this.day = day;
		this.hour = hour;
	}
	RateCardbillingUnitsList = [
		{ label: 'Hours', value: 'hour' },
		{ label: 'Days', value: 'day' }
	];
	day: { week: number, day: number, month: number };
	hour: { week: number, day: number, month: number };
}

export enum TrackVehicle{
  trackVehcile='track-vehicle',
  vehciclePath='vehicle-path'
}

export const  categoryOptions:Record<string, number>={
    'crane':1,
    'awp':2,
    'cargo':0,
    'container':4,
	'general':10
  } 
