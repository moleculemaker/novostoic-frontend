import { Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { AbstractControl, AsyncValidator, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { BehaviorSubject, Observable, debounce, debounceTime, filter, map, switchMap, take } from "rxjs";
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
        debounceTime(500),
        switchMap((v) => this.novostoicService.getChemicalAutoComplete(v)),
        map((chemicals) => {
          const chemical = chemicals.find((chemical) => 
            chemical.name === control.value
            || chemical.inchi === control.value
            || chemical.inchi_key === control.value
            || chemical.smiles === control.value
            || chemical.metanetx_id === control.value
            || chemical.kegg_id === control.value
          );
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
