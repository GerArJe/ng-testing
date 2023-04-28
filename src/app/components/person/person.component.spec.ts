import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';

import { PersonComponent } from './person.component';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Alberto"', () => {
    component.person = new Person('Alberto', 'Gonzales', 28, 80, 1.8);
    expect(component.person.name).toEqual('Alberto');
  });

  it('should have <p> with "Mi altura es {{ person.height }}"', () => {
    component.person = new Person('Valentina', 'Gonzales', 28, 80, 1.8);
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;

    fixture.detectChanges();

    expect(pElement?.textContent).toContain(component.person.height);
  });

  it('should have <h3> with "Hola, {person.name}"', () => {
    component.person = new Person('Valentina', 'Gonzales', 28, 80, 1.8);
    const expectedMsg = `Hola, ${component.person.name}`;
    const personDebug: DebugElement = fixture.debugElement;
    const h3Debug: DebugElement = personDebug.query(By.css('h3'));
    const h3: HTMLElement = h3Debug.nativeElement;

    fixture.detectChanges();

    expect(h3?.textContent).toEqual(expectedMsg);
  });

  it('should display a text with IMC when call calcIMC', () => {
    const expectedMsg = 'overweight level 2';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const button: HTMLElement = fixture.debugElement.query(
      By.css('button.btn-imc')
    ).nativeElement;

    component.calcIMC();
    fixture.detectChanges();

    expect(button.textContent).toContain(expectedMsg);
  });

  it('should display a text with IMC when do click', () => {
    const expectedMsg = 'overweight level 2';
    component.person = new Person('Juan', 'Perez', 30, 120, 1.65);
    const buttonDebug = fixture.debugElement.query(By.css('button.btn-imc'));
    const buttonElement = buttonDebug.nativeElement;

    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(buttonElement.textContent).toContain(expectedMsg);
  });

  it('should raise selected event when click', () => {
    const expectPerson = new Person('Juan', 'Perez', 30, 120, 1.65);
    component.person = expectPerson;
    const buttonDebug = fixture.debugElement.query(By.css('button.btn-choose'));
    let selectedPerson: Person | undefined;
    component.onSelected.subscribe({
      next: (person: Person) => {
        selectedPerson = person;
      },
    });

    buttonDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(selectedPerson).toEqual(expectPerson);
  });
});

@Component({
  template: `<app-person
    [person]="person"
    (onSelected)="onSelected($event)"
  ></app-person>`,
})
class HostComponent {
  person = new Person('Santiago', 'Moreno', 14, 40, 1.5);
  selectedPerson?: Person;
  onSelected(person: Person) {
    this.selectedPerson = person;
  }
}
describe('PersonComponent from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    const expectedName = component.person.name;
    const h3Debug = fixture.debugElement.query(By.css('app-person h3'));
    const h3Element = h3Debug.nativeElement;

    fixture.detectChanges();

    expect(h3Element.textContent).toContain(expectedName);
  });
  
  it('should raise selected event when clicked', () => {
    const btnDebug = fixture.debugElement.query(By.css('app-person .btn-choose'));

    btnDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selectedPerson).toEqual(component.person);
  });
});
