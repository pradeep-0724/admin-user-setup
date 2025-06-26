export class AccountType {
  id: string;
  name: string;
  group: string;
}

export class Amount {
  credit: number;
  debit: number;
}

export class AccountObj {
  id: string;
  tenant?: any;
  name: string;
  account_type: AccountType;
  description: string;
  account?: any;
  is_system_account: boolean;
  is_user_created: boolean;
  is_editable: boolean;
  created_by?: any;
  accounts: AccountObj[];
  amount: Amount;
  show: boolean = false;
}
