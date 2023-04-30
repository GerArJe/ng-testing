import { Component } from '@angular/core';

import { Person } from '../../models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
})
export class PeopleComponent {
  people: Person[] = [
    new Person('Ricardo', 'Gomez', 28, 60, 1.8),
    new Person('Valentina', 'Gomez', 30, 50, 1.7),
  ];
  selectedPerson: Person | null = null;

  choose(person: Person) {
    this.selectedPerson = person;
  }
}
