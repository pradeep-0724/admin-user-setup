export class ErrorList {
    possibleErrors: any = {extrarows : {message: "Remove Unwanted rows.", status: true},
                         required: {message: "Enter all required fields.", status: true},
                         greaterthanzero: {message: "Total amount should be greater than zero.", status: true}};
    headerMessage: string = "Cannot submit form. Check following :"
  }
  