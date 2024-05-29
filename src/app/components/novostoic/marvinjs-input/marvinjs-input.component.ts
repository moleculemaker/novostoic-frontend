import { Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { AbstractControl, AsyncValidator, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { BehaviorSubject, Observable, combineLatest, combineLatestWith, debounce, debounceTime, filter, map, of, switchMap, take, tap } from "rxjs";
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

  userInput$ = new BehaviorSubject<string>("");
  validatedChemical$ = new BehaviorSubject<ChemicalAutoCompleteResponse|null>(null);

  smiles$ = this.validatedChemical$.pipe(
    filter((v) => !!v),
    map((v) => v!.smiles),
  );

  showDialog$ = new BehaviorSubject(false);

  constructor(private novostoicService: NovostoicService) {
    this.userInput$.pipe(
      debounceTime(1000),
      switchMap((v) => this.novostoicService.validateChemical(v)),
      combineLatestWith(this.userInput$),
      tap(([chemical, v]) => {
        if (chemical) {
          this.onChange(chemical.metanetx_id);
        } else {
          this.onChange(v);
        }
      })
    ).subscribe();
  }
  
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
    return control.valueChanges.pipe(
      debounceTime(1000),
      tap(console.log),
      switchMap((v) => this.novostoicService.validateChemical(v)),
      map((chemical) => {
        if (chemical) {
          return null;
        }
        return { chemicalNotSupported: true };
      }),
      take(1),
    );
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
