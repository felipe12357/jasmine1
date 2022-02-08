import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async testing examples",()=>{

    it('asyncronous test example with jasmine done()',(done: DoneFn)=>{
        let test =false;

        setTimeout(()=>{
            test =true;
            expect(test).toBe(true);
            done();
        },500)
    })

    it('asyncronous test example with fakeAsync()',fakeAsync(()=>{
        let test =false;

        setTimeout(()=>{
            console.log('running testa');
            test = true;
        },500);

       // tick(500);
        flush(); //flush se asegura que todo lo asincrono se halla completado  por lo tanto no se preocupa
        //por cuanto tiempo tiene que pasar
        expect(test).toBe(true);
    }))

    it('asyncrhonus test with promise 1',fakeAsync(()=>{
        let test = false;
        console.log('creating promise');
        Promise.resolve().then(()=>{
            console.log('changing the value');
             test = true;
        })
        tick();
        console.log('making expectations');
        expect(test).toBe(true);
    }))

    it('asyncrhonus test with promise 2',fakeAsync(()=>{
        let test = false;
        console.log('creating promise');
        Promise.resolve().then(()=>{
            console.log('primera promesa')
           return Promise.resolve();
        }).then(()=>{
            console.log('changing the value');
             test = true;
        })
        // tick();
        flushMicrotasks();
        console.log('making expectations');
        expect(test).toBe(true);
    }))

    it('asyncronus test example- microtask promises and macro task setTimeOUT',fakeAsync(()=>{
        let counter =0;

        Promise.resolve().then(()=>{ 
            counter+=10;
            setTimeout(()=>{
                counter +=1;
            },1000);
        })
        flushMicrotasks();
        expect(counter).toBe(10);
        tick(1000);
        expect(counter).toBe(11);
    }))

    it('asyncronus test - observables',()=>{
        let test =false;

        console.log('creating Observable');

        const test$=of(false);
        
        test$.subscribe(()=>{
            test =true;
        })
        //para observables no es necesario utilizar fake Async
        expect(test).toBe(true);
    })

    it('asyncronus test - observables con delay',fakeAsync(()=>{
        let test =false;

        console.log('creating Observable');

        const test$=of(false).pipe(delay(100));
        
        test$.subscribe(()=>{
            test =true;
        })

        tick(100); 
        //En este caso es necesario tick debido al delay
        expect(test).toBe(true);
    }))
})