import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import { NovostoicService } from './services/novostoic.service';
import { map } from 'rxjs';

export function chemicalSupportedValidator(novostoicService: NovostoicService):AsyncValidatorFn  {
    return (control: AbstractControl) => {
        return novostoicService.getChemicalAutoComplete(control.value)
            .pipe(map((chemicals) => chemicals.length ? null : { chemicalNotSupported : true }));
    }
}