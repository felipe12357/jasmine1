import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let componentDebugElement: DebugElement;
  let coursesService: any;

  const courseServiceSpy = jasmine.createSpyObj(CoursesService,['findAllCourses']);
  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED')

  beforeEach((() => {
   
    TestBed.configureTestingModule({
      imports:[
        CoursesModule,
        NoopAnimationsModule, //es un modulo para poder saltar las animaciones
      ],
      providers:[
        {provide:CoursesService, useValue:courseServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    componentDebugElement = fixture.debugElement;
    coursesService = TestBed.inject(CoursesService);

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();

    const tabs = componentDebugElement.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1);

  });


  it("should display only advanced courses", () => {

    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();

    const tabs = componentDebugElement.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1);

  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = componentDebugElement.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2);

  });

  //done: DoneFn con esto obliga a esperar la respuesta para evaluar la prueba
  //util cuando hacemos evaluaciones en bloques como .then 'o .subscribe
  it("should display advanced courses when tab clicked", (done: DoneFn) => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = componentDebugElement.queryAll(By.css(".mat-tab-label"));
    //dependiendo del tipo de elemento que es el click se ejecuta asi:
    /*
        if (el instanceof HTMLElement) { //nativeElement
        el.click();
      } else {
        el.triggerEventHandler('click', eventObj);
      }
    */
    //pro lo tanto el evento click se puede ejecutar de cualqueira de las 2 sigueintes formas
   // tabs[1].triggerEventHandler('click',null);
    tabs[1].nativeElement.click()
    
    fixture.detectChanges();
    setTimeout(()=>{
      const cardsTitles = componentDebugElement.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
      expect(cardsTitles.length).toBeGreaterThan(0);
      const testCourse =cardsTitles[0];
      expect(testCourse.nativeElement.textContent).toContain("Angular Security Course");
      done();
    },1000); //debido a las animaciones de la aplaciones
   
  });

  it("should display advanced courses when tab clicked fakeAsync", fakeAsync(() => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));
      fixture.detectChanges();

      const tabs = componentDebugElement.queryAll(By.css(".mat-tab-label"));
      //pro lo tanto el evento click se puede ejecutar de cualqueira de las 2 sigueintes formas
      // tabs[1].triggerEventHandler('click',null);
      tabs[1].nativeElement.click();
      fixture.detectChanges();
      tick(1000); //debido a las animaciones de la aplaciones
      const cardsTitles = componentDebugElement.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
      expect(cardsTitles.length).toBeGreaterThan(0);
      const testCourse =cardsTitles[0];
      expect(testCourse.nativeElement.textContent).toContain("Angular Security Course");
  }));

  it("should display advanced courses when tab clicked waitForAsync", waitForAsync(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; //para esta prueba fue necesario ajustar esta vairable
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = componentDebugElement.queryAll(By.css(".mat-tab-label"));
    //pro lo tanto el evento click se puede ejecutar de cualqueira de las 2 sigueintes formas
    // tabs[1].triggerEventHandler('click',null);
    tabs[1].nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      const cardsTitles = componentDebugElement.queryAll(By.css(".mat-tab-body-active .mat-card-title"));
      expect(cardsTitles.length).toBeGreaterThan(0);
      const testCourse =cardsTitles[0];
      expect(testCourse.nativeElement.textContent).toContain("Angular Security Course");
    });
  
  }));

});


