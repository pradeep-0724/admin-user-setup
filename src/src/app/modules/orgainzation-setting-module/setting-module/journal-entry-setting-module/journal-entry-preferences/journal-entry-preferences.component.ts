import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-journal-entry-preferences',
  templateUrl: './journal-entry-preferences.component.html',
  styleUrls: ['./journal-entry-preferences.component.scss']
})
export class JournalEntryPreferencesComponent implements OnInit {

  constructor() { }

  journalentry = 'journalentry';

  ngOnInit() {
  }

}
