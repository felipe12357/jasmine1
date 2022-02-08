import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService TestBed',()=>{
    let coursesService:CoursesService;
    let httpTestingController: HttpTestingController

    beforeEach(()=>{

        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[
                CoursesService,
            ]
        })

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController)
    })

    afterEach(()=>{
        //verifica q solo se ejecute solo la peticion solicitada.
       httpTestingController.verify(); 
    })

    it('should retrieve all courses',()=>{

        coursesService.findAllCourses().subscribe(courses =>{
            expect(courses).toBeTruthy();
            expect(courses.length).toBe(12);

            const course12 = courses.find(course =>course.id === 12);
            expect(course12.titles.description).toBe("Angular Testing Course");
        })

        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual("GET");
        //flush: con esto simulamos la respuesta del servidor
        //en este caso retornamos el objeto de la BD courses
        req.flush({payload:Object.values(COURSES)})
    })

    it('should find a course by id',()=>{
        coursesService.findCourseById(12).subscribe(course =>{
            expect(course).toBeTruthy();
            expect(course.id).toBe(12);
        })

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");
        //flush: con esto simulamos la respuesta del servidor
        //en este caso retornamos solo el curso en la posicion 12
        req.flush(COURSES[12])
    })

    it('should save the course data',()=>{
        const changes: Partial<Course> = {titles:{description: 'Testing Course'}};
        coursesService.saveCourse(12,changes).subscribe(course =>{
            expect(course.id).toBe(12);
        })
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        //flush: con esto simulamos la respuesta del servidor
        //en este caso retornamos el objeto 12 y lo modificamos
        req.flush({...COURSES[12],...changes})
    })

    it('should give an error if save course fails',()=>{
        const changes: Partial<Course> = {titles:{description: 'Testing Course'}};
        coursesService.saveCourse(12,changes).subscribe(
            () =>{ },
            (error: HttpErrorResponse)=>{
                expect(error.status).toBe(500)
            }
        );

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");
        //flush: con esto simulamos la respuesta del servidor
        //en este caso un erro por parte del sistema
        req.flush('save course failed',{status:500, statusText:'Internal Server Error'})
    })

    it('should find a list of lessons',()=>{
        coursesService.findLessons(12).subscribe(lessons =>{
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3);
        })
    
        const req = httpTestingController.expectOne( req => req.url === '/api/lessons');

        expect(req.request.method).toEqual('GET');
        expect(req.request.params.get('courseId')).toEqual("12");
        expect(req.request.params.get('filter')).toEqual("");
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({payload:Object.values(LESSONS).filter(lesson => lesson.courseId == 12).slice(0,3)})
    })
})