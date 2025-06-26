import { isValidValue } from "src/app/shared-module/utilities/helper-utils"

export function getEmployeeObject(employeeList,employeeId){
    const employeeObj=employeeList.find(employee=>employee['id']==employeeId)
    if(isValidValue(employeeObj) && isValidValue(employeeList)){
         return  employeeObj
    }
    return null
}