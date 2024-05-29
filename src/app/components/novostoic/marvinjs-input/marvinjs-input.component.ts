import { Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { AbstractControl, AsyncValidator, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { BehaviorSubject, Observable, combineLatest, combineLatestWith, debounce, debounceTime, filter, first, map, of, share, shareReplay, single, switchMap, take, tap, throttleTime, withLatestFrom } from "rxjs";
import { ChemicalAutoCompleteResponse } from "~/app/api/mmli-backend/v1";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-marvinjs-input",
  templateUrl: "./marvinjs-input.component.html",
  styleUrls: ["./marvinjs-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarvinjsInputComponent),
      multi: true
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => MarvinjsInputComponent),
      multi: true
    }
  ]
})
export class MarvinjsInputComponent implements ControlValueAccessor, AsyncValidator {
  @Input() placeholder: string = "";
  @Input() errors: ValidationErrors | null;
  @Input() dirty: boolean = false;
  @Output() onChemicalValidated = new EventEmitter<ChemicalAutoCompleteResponse | null>();

  userInput$ = new BehaviorSubject<string>("");

  showDialog$ = new BehaviorSubject(false);

  validateCache = new Map();
  validatedChemical$ = this.userInput$.pipe(
    debounceTime(1000),
    switchMap((v) => 
      this.validateCache.has(v) 
      ? of(this.validateCache.get(v) as ChemicalAutoCompleteResponse)
      : this.novostoicService.validateChemical(v)
    ),
    withLatestFrom(this.userInput$),
    tap(([chemical, v]) => {
      if (!this.validateCache.has(v)) {
        this.validateCache.set(v, chemical);
        this.onChange(chemical?.metanetx_id || v);
        this.onTouched();
      }
    }),
  );

  smiles$ = this.validatedChemical$.pipe(
    filter(([chemical, _]) => !!chemical),
    map(([chemical, _]) => chemical!.smiles),
  );

  constructor(private novostoicService: NovostoicService) {}
  
  /* -------------------------------------------------------------------------- */
  /*                      Control Value Accessor Interface                      */
  /* -------------------------------------------------------------------------- */
  disabled = false;
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: string): void {
    this.userInput$.next(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /* -------------------------------------------------------------------------- */
  /*                          Async Validator Interface                         */
  /* -------------------------------------------------------------------------- */
  onValidatorChange = () => {};

  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.validatedChemical$.pipe(
      map(([chemical, _]) => {
        if (chemical) {
          this.onChemicalValidated.emit(chemical);
          return null;
        }
        return { chemicalNotSupported: true };
      }),
      first()
    );
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
