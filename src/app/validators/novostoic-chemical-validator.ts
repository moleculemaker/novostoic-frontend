import { ValidationErrors } from "@angular/forms";
import { AbstractControl } from "@angular/forms";

export function presenceEnforcementOnAmountAndMolecule(control: AbstractControl): ValidationErrors | null {
  const amount = control.value.amount;
  const molecule = control.value.molecule;
  if ((!amount && !molecule) || (amount && molecule)) {
    return null;
  }
  return { amountOrMoleculeRequired: true };
}

export function requireBothAmountAndMolecule(control: AbstractControl): ValidationErrors | null {
  const amount = control.value.amount;
  const molecule = control.value.molecule;
  if (!amount) {
    return { amountRequired: true };
  }
  if (!molecule) {
    return { moleculeRequired: true };
  }
  return null;
}