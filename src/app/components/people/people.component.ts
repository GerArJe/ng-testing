import { Component } from '@angular/core';

import { Person } from '../../models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})
export class PeopleComponent {
  person: Person = new Person('Ricardo', 'Gomez', 28, 60, 1.8);
}
