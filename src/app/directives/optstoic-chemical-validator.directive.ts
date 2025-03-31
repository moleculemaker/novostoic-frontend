import { Directive, EventEmitter, forwardRef, Output } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Loadable, NovostoicService } from '../services/novostoic.service';
import { debounceTime, distinctUntilChanged, filter, first, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { ChemicalAutoCompleteResponse } from '../api/mmli-backend/v1';

@Directive({
  selector: '[appOptstoicChemicalValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => OptstoicChemicalValidatorDirective),
      multi: true
    }
  ]
})
export class OptstoicChemicalValidatorDirective implements AsyncValidator {
  @Output() onChemicalValidationStatusChange = new EventEmitter<Loadable<ChemicalAutoCompleteResponse>>();

  constructor(private novostoicService: NovostoicService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value || control.value.trim() === '') {
      this.onChemicalValidationStatusChange.emit({
        status: 'na',
        data: null
      });
      return of({ required: true });
    }
    return control.valueChanges.pipe(
      tap(() => {
        this.onChemicalValidationStatusChange.emit({
          status: 'loading',
          data: null
        })
      }),
      startWith(control.value),
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(() => this.novostoicService.validateChemical(control.value)),
      filter((result: Loadable<ChemicalAutoCompleteResponse>) => 
          result.status === 'loaded' 
        || result.status === 'error' 
        || result.status === 'invalid'
      ),
      map((result: Loadable<ChemicalAutoCompleteResponse>) => {
        this.onChemicalValidationStatusChange.emit(result);
        if (result.status === 'error' || result.status === 'invalid') {
          return { chemicalNotSupported: true };
        }
        return null;
      }),
      first()
    );
  }
}
