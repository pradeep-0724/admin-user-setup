import { CountryDetails } from "src/app/core/constants/country-details.constant";

export function getCountryCode(countryId){
  let countryDetails=CountryDetails.filter(country=>country.id==countryId)[0];
  return countryDetails.phone_code
}
export function getCountryDetails(countryId){
  let countryDetails=CountryDetails.filter(country=>country.id==countryId)[0];
  return countryDetails
}
