import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'partyListSearchFilter'
})
export class PartyListSearchFilterPipe implements PipeTransform {
	transform(value: any[], searchString: string) {
    if (!searchString) {
			return value;
		}

		return value.filter((it) => {
			const party_name = it.display_name.toLowerCase().includes(searchString.toLowerCase());
			const contact_person_name = it.contact_person	? it.contact_person.name.toLowerCase().includes(searchString.toLowerCase()): false;
			const contact_person_number = it.contact_person	? it.contact_person.contact_number.toLowerCase().includes(searchString.toLowerCase()): false;
			const party_type = it.party_type ? it.party_type.toLowerCase().includes(searchString.toLowerCase()) : '';
			const party_company_name = it.company_name? it.company_name.toLowerCase().includes(searchString.toLowerCase()): false;
			const gst_treatment = it.gst? it.gst.toLowerCase().includes(searchString.toLowerCase())	: false;
			return (
				party_name ||
				contact_person_name ||
				contact_person_number ||
				party_type ||
				party_company_name ||
				gst_treatment
			);
		});
	}
}
