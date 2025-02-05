import { Directive, EventEmitter, forwardRef, Output } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { NovostoicService } from '../services/novostoic.service';
import { debounceTime, distinctUntilChanged, first, map, Observable, of, startWith, switchMap } from 'rxjs';
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
  @Output() onChemicalValidated = new EventEmitter<ChemicalAutoCompleteResponse|null>();

  constructor(private novostoicService: NovostoicService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.value || control.value.trim() === '') {
      return of(null);
    }
    return control.valueChanges.pipe(
      startWith(control.value),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => this.novostoicService.validateChemical(control.value)),
      map((chemical: any) => {
        if (chemical) {
          this.onChemicalValidated.emit(chemical);
          return null;
        }
        return { chemicalNotSupported: true };
      }),
      first()
    );
  }
}
