import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
//import { Test } from 'mocha';




describe('CoursesCardListComponent', () => {

  let component:CoursesCardListComponent; 
  let fixture:ComponentFixture<CoursesCardListComponent>;
  let componentDebugElement:DebugElement;

  beforeEach(
    //segun la version de angular es necesario usar async
    //para q de esta forma espere a q la promesa este completa (el then block)
    async()=>{
    TestBed.configureTestingModule({
      imports:[CoursesModule],
      //como courses module ya tiene definido el componente
      //por ese motivo no es necesario  declarar el component
      declarations:[
        CoursesCardListComponent
      ]
    }).compileComponents().then(()=>{
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      componentDebugElement = fixture.debugElement;
    })
  })

  it("should create the component", () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    //cada vez que actualicemos la data del componente es necesario que este detecte los cambios
    fixture.detectChanges();
    const cards = componentDebugElement.queryAll(By.css(".course-card"));

    //de esta forma puede verse el estado del component (en la consola del navegador)
    //console.log(componentDebugElement.nativeElement.outerHTML);
    expect(cards).toBeTruthy();
    expect(cards.length).toBe(12);

  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    //cada vez que actualicemos la data del componente es necesario que este detecte los cambios
    fixture.detectChanges();
     
    const course = component.courses[0];
    const card = componentDebugElement.query(By.css('.course-card:first-child'));
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));

    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});


