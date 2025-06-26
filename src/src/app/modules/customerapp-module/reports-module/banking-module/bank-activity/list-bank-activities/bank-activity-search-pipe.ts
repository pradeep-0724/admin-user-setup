import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'bankActivityFilter'
})
export class BankActivitySearchPipe implements PipeTransform {
	transform(value: any[], searchString: string) {
    if (!searchString) {
			return value;
		}

		return value.filter((it) => {
			let date = it.date
				? it.date.toLowerCase().includes(searchString.toLowerCase())
        : false;
      let bank_activity_number = false;
      let transaction_date = false;
      let reference_number = false;
      let deposited_in = false;
      let withdrawl_from = false;
      let amount = false;

      if(it && it.activities && it.activities.length>0) {
        for(let act of it.activities) {
          if(act.bank_activity_number && act.bank_activity_number.toString().toLowerCase().includes(searchString.toLowerCase())) {
            bank_activity_number = true;
            break;
          }
          if(act.transaction_date && act.transaction_date.toString().toLowerCase().includes(searchString.toLowerCase())) {
            transaction_date = true;
            break;
          }
          if(act.reference_number && act.reference_number.toString().toLowerCase().includes(searchString.toLowerCase())) {
            reference_number = true;
            break;
          }
          if(act.deposited_in && act.deposited_in.name && act.deposited_in.name.toLowerCase().includes(searchString.toLowerCase())) {
            deposited_in = true;
            break;
          }
          if(act.withdrawl_from && act.withdrawl_from.name && act.withdrawl_from.name.toLowerCase().includes(searchString.toLowerCase())) {
            withdrawl_from = true;
            break;
          }
          if(act.amount && act.amount.toString().toLowerCase().includes(searchString.toLowerCase())) {
            amount = true;
            break;
          }
        }
      }
			return (
        date ||
				bank_activity_number ||
        transaction_date ||
				reference_number ||
				deposited_in ||
        withdrawl_from ||
        amount
			);
		});
	}
}
