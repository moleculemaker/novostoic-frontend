import { Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { AbstractControl, AsyncValidator, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { BehaviorSubject, Observable, debounce, debounceTime, filter, map, switchMap, take, tap } from "rxjs";
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

  _value = "";
  get value() {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.onChange(value);
    this.onTouched();
  }

  _smiles = "";
  get smiles() {
    return this._smiles;
  }

  set smiles(value: string) {
    this._smiles = value;
    if (this.value !== value) {
      this.value = value;
    }
  }

  showDialog$ = new BehaviorSubject(false);

  constructor(private novostoicService: NovostoicService) {}
  
  /* -------------------------------------------------------------------------- */
  /*                      Control Value Accessor Interface                      */
  /* -------------------------------------------------------------------------- */
  disabled = false;
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: string): void {
    this.value = obj;
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
        switchMap((v) => this.novostoicService.validateChemical(v)),
        tap((chemical) => this.onChemicalValidated.emit(chemical)),
        map((chemical) => {
          if (chemical) {
            this.smiles = chemical.smiles;
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
