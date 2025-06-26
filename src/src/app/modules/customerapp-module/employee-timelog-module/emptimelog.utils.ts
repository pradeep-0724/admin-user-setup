export function filterDuplicates(duplicateNames){
     return duplicateNames.filter((item, index) => index !== duplicateNames.indexOf(item));
}