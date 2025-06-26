import { Component, OnInit } from '@angular/core';
import { NewTripV2Constants } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';

@Component({
  selector: 'app-debit-note-preferences',
  templateUrl: './debit-note-preferences.component.html',
  styleUrls: ['./debit-note-preferences.component.scss']
})
export class DebitNotePreferencesComponent implements OnInit {

  tripToolTipForBrandingLine :  ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();

  constructor() { }

  ngOnInit() {
    this.tripToolTipForBrandingLine = {
      content: this.constantsTripV2.toolTipMessages.DEBITTNOTE_SETTINGS_BRANDING_LINE.CONTENT
    }
  }

}
