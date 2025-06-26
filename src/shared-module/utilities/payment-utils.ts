import { getObjectFromList } from './helper-utils';
import {  AbstractControl } from '@angular/forms';

const bankMethods = [
	'RTGS',
	'CARD',
	'CHEQUE',
	'BANK',
	// 'BANK OD A/C',
	'CASH IN HAND',
	'Petty Cash',
	'Undeposited Funds'
];

export function isBankChargeRequired(id: String, list: any[]): Boolean {
	const selectedPaymentMethod: String = getObjectFromList(id, list).account_type;
	let is_disable = bankMethods.includes(selectedPaymentMethod.toUpperCase());
  return is_disable
}


const notAllowedbankMethods = [
	'CASH IN HAND',
];

export function bankChargeRequired(id: string, formControl?: AbstractControl, accountList: Array<Object>=[]): boolean {
	if (!id)
		return false;
	const account = getObjectFromList(id, accountList);
	if (!account)
		return false;

	const selectedPaymentMethod: String = account.account_type;
	let is_disable = notAllowedbankMethods.includes(selectedPaymentMethod.toUpperCase());
	if (is_disable)
		if (formControl)
			formControl.setValue(0);
  	return !is_disable
}
