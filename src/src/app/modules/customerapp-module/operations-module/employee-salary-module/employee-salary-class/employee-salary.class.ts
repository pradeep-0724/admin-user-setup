import { UntypedFormArray, UntypedFormGroup} from "@angular/forms";
export class EmployeeSalaryClass{

    employeeSalaryForm: UntypedFormGroup;
    total=0;




    calculateAllEmployeeSalary() {
        const employeeSalary = this.employeeSalaryForm.controls['salary_details'] as UntypedFormArray;
        employeeSalary.controls.forEach(ele => {
          let total = Number(ele.get('salary_paid').value) + Number(ele.get('allowance_paid').value)
          ele.get('total').setValue(Number(total).toFixed(3));
        })
        this.claculateTotal();
      }

      claculateTotal(){
        let form = this.employeeSalaryForm;
        let salaryTotal=0;
        let salaryArray = form.get('salary_details') as UntypedFormArray;
        salaryArray.controls.forEach(item =>{
          salaryTotal =salaryTotal+ Number(item['value'].total)
        })
        let othersTotal=0
        let otherArray = form.get('other_expenses') as UntypedFormArray;
        otherArray.controls.forEach(item =>{
          othersTotal = othersTotal + Number(item['value'].amount_paid)
        })

        this.total = salaryTotal + othersTotal;
      }

      onAmountChange(form){
          this.claculateTotal()
      }

      onCalculationChange(form){
        let total = Number(form.get('salary_paid').value) + Number(form.get('allowance_paid').value)
        form.get('total').setValue(Number(total).toFixed(3));
        this.claculateTotal();
      }



}
