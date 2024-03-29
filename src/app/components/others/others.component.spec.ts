import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { OthersComponent } from './others.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ReversePipe } from '../../pipes/reverse.pipe';

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersComponent, HighlightDirective, ReversePipe ],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
