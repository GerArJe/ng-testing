import { Component, Input } from '@angular/core';

import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
})
export class PersonComponent {
  @Input() person: Person = new Person('', '', 0, 0, 0);
}
