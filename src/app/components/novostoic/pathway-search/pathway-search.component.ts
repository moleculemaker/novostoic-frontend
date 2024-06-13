import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { PathwaySearchRequest } from "~/app/models/pathway-search";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { NovostoicService } from "~/app/services/novostoic.service";
import { JobType } from "~/app/api/mmli-backend/v1";

@Component({
  selector: "app-pathway-search",
  templateUrl: "./pathway-search.component.html",
  styleUrls: ["./pathway-search.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class PathwaySearchComponent implements OnInit {
  request = new PathwaySearchRequest();
  editing$ = new BehaviorSubject(false);
  showDialog$ = new BehaviorSubject(false);
  warningVisible$ = new BehaviorSubject(false);
  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");

  // to maintain consistency when user goes from overall stoichiometry page
  // those values are used to populate the initial form
  primaryPrecursor$ = new BehaviorSubject({
    smiles: "N/A",
    name: "N/A",
    kegg_id: "N/A",
    structure: "",
  });
  targetMolecule$ = new BehaviorSubject({
    smiles: "N/A",
    name: "N/A",
    kegg_id: "N/A",
    structure: "",
  });
  stoichiometry$ = new BehaviorSubject({
    reactants: [
      {
        molecule: {
          smiles: "N/A",
          name: "N/A",
          kegg_id: "N/A",
          structure: "",
        },
        amount: -1,
      },
    ],
    products: [
      {
        molecule: {
          smiles: "N/A",
          name: "N/A",
          kegg_id: "N/A",
          structure: "",
        },
        amount: -1,
      },
      {
        molecule: {
          smiles: "N/A",
          name: "N/A",
          kegg_id: "N/A",
          structure: "",
        },
        amount: -1,
      },
    ],
  });

  showWarning$ = combineLatest([
    this.warningVisible$,
    this.editing$
  ]).pipe(map(([visible, editing]) => visible && !editing));

  // TODO: move to ConfirmationService once update angular
  warningMessage = "The current overall stoichiometry input comes from the previous step - Overall Stoichiometry - of NovoStoic. If you click clear all, you are starting a new request on “Pathway Search”. You can find previous steps results in the Job Management."
  acceptLabel = "Clear all and start a new request input"
  rejectLabel = "Stay on this page"
  confirmCallback = this.clearAllCallback

  constructor(
    private router: Router,
    private location: Location,
    private novostoicService: NovostoicService) {}

  ngOnInit(): void {
    const state: any = this.location.getState();
    // check if the user comes from overall stoichiiometry page
    if (Object.hasOwn(state, "primaryPrecursor")) {
      this.primaryPrecursor$.next(state.primaryPrecursor);
      this.targetMolecule$.next(state.targetMolecule);
      this.stoichiometry$.next(state.stoichiometry);

      this.request.addPrimaryPercursorFromMolecule(state.primaryPrecursor);
      this.request.addTargetMoleculeFromMolecule(state.targetMolecule);
      this.request.addFromStoichiometry(state.stoichiometry);
    } else {
      this.editing$.next(true);
    }
  }

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    this.novostoicService.createJobAndRun(
      JobType.NovostoicPathways,
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.PATHWAY_SEARCH, "result", response.job_id]);
    });
  }

  confirmUsingExample() {
    this.confirmCallback = this.useExampleCallback;
    this.warningMessage = "The current overall stoichiometry input comes from the previous step - Overall Stoichiometry - of NovoStoic. If you click Use an Example, you are starting a new request on “Pathway Search”. You can find previous steps results in the Job Management.";
    this.acceptLabel = "Clear all and use an example";
    this.warningVisible$.next(true);
  }

  confirmClearAll() {
    this.confirmCallback = this.clearAllCallback;
    this.warningMessage = "The current overall stoichiometry input comes from the previous step - Overall Stoichiometry - of NovoStoic. If you click clear all, you are starting a new request on “Pathway Search”. You can find previous steps results in the Job Management.";
    this.acceptLabel = "Clear all and start a new request input";
    this.warningVisible$.next(true);
  }

  searchStructure() {}

  clearAllCallback() {
    this.warningVisible$.next(false);
    this.editing$.next(true);
    this.request.resetStoichiometry();
  }

  useExampleCallback() {
    this.warningVisible$.next(false);
    this.editing$.next(true);
    this.request = PathwaySearchRequest.useExample();
  }
}
