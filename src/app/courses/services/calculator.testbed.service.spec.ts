import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService TestBed',()=>{
    let calculator:CalculatorService;
    let mockLoggerService:LoggerService;

    beforeEach(()=>{

        //de esta forma jasmine mockea el servicio y automaticamente esta siendo espiado
        mockLoggerService = jasmine.createSpyObj(LoggerService,['log']);

        TestBed.configureTestingModule({
            providers:[
                CalculatorService,
                {provide:LoggerService, useValue:mockLoggerService}
            ]
        })

        calculator = TestBed.inject(CalculatorService)
    })

    //Mockeando loggerService
    it('should add 2 numbers',()=>{
        const result = calculator.add(2,2);
        expect(result).toBe(4);
    })

    it('should call log method 1 time',()=>{
        calculator.add(2,2);
        expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    })
})