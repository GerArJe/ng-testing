import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HighlightDirective } from './highlight.directive';

@Component({
  template: `
    <h5 class="title" highlight>default</h5>
    <h5 highlight="yellow">yellow</h5>
    <p highlight="blue">parrafo</p>
    <p>otro parrafo</p>
  `,
})
class HostComponent {}

describe('HighlightDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, HighlightDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have three highlight elements', () => {
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const elementsWithout = fixture.debugElement.queryAll(
      By.css('*:not([highlight])')
    );
    expect(elements.length).toEqual(3);
    expect(elementsWithout.length).toEqual(1);
  });

  it('should the elements be match with bgColor', () => {
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    expect(elements[0].nativeElement.style.backgroundColor).toEqual('gray');
    expect(elements[1].nativeElement.style.backgroundColor).toEqual('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toEqual('blue');
  });

  it('should the h5.title be default color', () => {
    const titleDe = fixture.debugElement.query(By.css('.title'));
    const dir = titleDe.injector.get(HighlightDirective);
    expect(titleDe.nativeElement.style.backgroundColor).toEqual(
      dir.defaultColor
    );
  });
});
