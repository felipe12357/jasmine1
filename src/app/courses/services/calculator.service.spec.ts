import {CalculatorService} from './calculator.service';
import { LoggerService } from './logger.service';

describe('CalculatorService',()=>{
    let calculator:CalculatorService;
    let loggerService:LoggerService;

    let mockLogger:LoggerService;
    let calculator2:CalculatorService;

    beforeEach(()=>{
        loggerService = new LoggerService();
        calculator = new CalculatorService(loggerService);

        //de esta forma jasmine mockea el servicio y automaticamente esta siendo espiado
        mockLogger = jasmine.createSpyObj(LoggerService,['log']);
        calculator2  = new CalculatorService(mockLogger)
    })

    it('should add 2 numbers',()=>{
        const result = calculator.add(2,2);
        expect(result).toBe(4)
    })

    it('should subtract 2 numbers',()=>{
        const result = calculator.subtract(2,2);
        expect(result).toBe(0)
    })

    it('should call log method one time',()=>{
        const spy = spyOn(loggerService,'log');
        calculator.add(2,2);
        expect(spy).toHaveBeenCalledTimes(1);
    })

    //segunda forma de utilizar el spy
    it('should call log method one time',()=>{
        spyOn(loggerService,'log');
        calculator.subtract(2,2);
        expect(loggerService.log).toHaveBeenCalledTimes(1);
    })

    //Mockeando loggerService
    it('should add 2 numbers',()=>{
        const result = calculator2.add(2,2);
        expect(result).toBe(4)
        expect(mockLogger.log).toHaveBeenCalledTimes(1);
    })
})