import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-molecule-input-with-amount',
  templateUrl: './molecule-input-with-amount.component.html',
  styleUrls: ['./molecule-input-with-amount.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoleculeInputWithAmountComponent),
      multi: true
    }
  ]
})
export class MoleculeInputWithAmountComponent implements OnChanges, ControlValueAccessor {
  @Input() config: {
    amount: {
      min: number;
      max: number;
      step: number;
      disableSignInput: boolean;
      disableExponentialInput: boolean;
    };
    required: boolean;
  };

  @Input() value: { 
    amount: number | null; 
    molecule: string | null;
  } | null = null;

  @Output() valueChange = new EventEmitter<{ 
    amount: number | null; 
    molecule: string | null;
  }>();

  #inputAmount = 0;
  #inputMolecule = "";

  onChange: (value: { amount: number | null; molecule: string | null }) => void = () => {};
  onTouched: () => void = () => {};

  get inputAmount() {
    return this.#inputAmount;
  }

  set inputAmount(value: number | null) {
    this.#inputAmount = value ?? 0;
    this.valueChange.emit({ amount: value, molecule: this.#inputMolecule });
    this.onChange({ amount: value, molecule: this.#inputMolecule });
  }

  get inputMolecule() {
    return this.#inputMolecule;
  }

  set inputMolecule(value: string) {
    this.#inputMolecule = value;
    this.valueChange.emit({ amount: this.#inputAmount, molecule: value });
    this.onChange({ amount: this.#inputAmount, molecule: value });
  }

  constructor() {
    if (this.value?.amount) {
      this.#inputAmount = this.value.amount;
    }
    if (this.value?.molecule) {
      this.#inputMolecule = this.value.molecule;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.#inputAmount = this.value?.amount ?? 0;
      this.#inputMolecule = this.value?.molecule ?? "";
    }
  }

  onNumberInputKeyDown(event: KeyboardEvent) {
    if (this.config.amount.disableSignInput && (event.key === '-' || event.key === '+')) {
      event.preventDefault();
    }
    if (this.config.amount.disableExponentialInput && (event.key === 'e' || event.key === 'E')) {
      event.preventDefault();
    }
  }

  writeValue(value: { amount: number | null; molecule: string | null }): void {
    this.#inputAmount = value.amount ?? 0;
    this.#inputMolecule = value.molecule ?? "";
  }

  registerOnChange(fn: (value: { amount: number | null; molecule: string | null }) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // not available
  }
}
