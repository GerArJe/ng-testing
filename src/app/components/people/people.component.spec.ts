import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PersonComponent } from '../person/person.component';
import { PeopleComponent } from './people.component';
import { Person } from '../../models/person.model';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    component.people = [
      new Person('Ricardo', 'Gomez', 28, 60, 1.8),
      new Person('Valentina', 'Gomez', 30, 50, 1.7),
      new Person('Sara', 'Perez', 30, 50, 1.7),
    ];

    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));

    expect(debugElement.length).toEqual(3);
  });

  it('should raise selected event when clicked', () => {
    const buttonDebugElement = fixture.debugElement.query(
      By.css('app-person .btn-choose')
    );

    buttonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selectedPerson).toEqual(component.people[0]);
  });

  it('should render the selected person', () => {
    const buttonDebugElement = fixture.debugElement.query(
      By.css('app-person .btn-choose')
    );
    
    buttonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    const liDebugElement = fixture.debugElement.query(
      By.css('.selectedPerson ul > li')
    );
    
    expect(component.selectedPerson).toEqual(component.people[0]);
    expect(liDebugElement.nativeElement.textContent).toContain(
      component.selectedPerson?.name
    );
  });
});
