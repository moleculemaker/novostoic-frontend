import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, combineLatest, first, forkJoin, from, map, of, switchMap } from "rxjs";
import { PathwaySearchRequest } from "~/app/models/pathway-search";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { NovostoicService } from "~/app/services/novostoic.service";
import { ChemicalAutoCompleteResponse, JobType } from "~/app/api/mmli-backend/v1";

@Component({
  selector: "app-pathway-search",
  templateUrl: "./pathway-search.component.html",
  styleUrls: ["./pathway-search.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class PathwaySearchComponent implements OnInit {
  request = new PathwaySearchRequest(this.novostoicService);
  editing$ = new BehaviorSubject(false);
  showDialog$ = new BehaviorSubject(false);
  warningVisible$ = new BehaviorSubject(false);
  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");

  // to maintain consistency when user goes from overall stoichiometry page
  // those values are used to populate the initial form
  primaryPrecursor$ = new BehaviorSubject<ChemicalAutoCompleteResponse | null>(null);
  targetMolecule$ = new BehaviorSubject<ChemicalAutoCompleteResponse | null>(null);
  stoichiometry$ = new BehaviorSubject<{
    reactants: { molecule: ChemicalAutoCompleteResponse; amount: number }[];
    products: { molecule: ChemicalAutoCompleteResponse; amount: number }[];
  } | null>(null);

  showWarning$ = combineLatest([
    this.warningVisible$,
    this.editing$
  ]).pipe(map(([visible, editing]) => visible && !editing));

  // TODO: move to ConfirmationService once update angular
  warningMessage = "The current overall stoichiometry input comes from the previous step - Overall Stoichiometry - of NovoStoic. If you click clear all, you are starting a new request on “Pathway Search”. You can find previous steps results in the Job Management."
  acceptLabel = "Clear all and start a new request input"
  rejectLabel = "Stay on this page"
  confirmCallback = this.clearAllCallback
  exampleJobId = "bbabbd4fb3b747a7a7302172698d7499";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private novostoicService: NovostoicService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.has("input")) {
        const input = JSON.parse(decodeURIComponent(params.get("input")!));

        const reactantsAndProducts: string[] = input.stoichiometry.reactants.map((e: any) => e.molecule)
          .concat(input.stoichiometry.products.map((e: any) => e.molecule));

        const primaryPrecursor$ = this.novostoicService.validateChemical(input.primaryPrecursor);
        const targetMolecule$ = this.novostoicService.validateChemical(input.targetMolecule);
        const molecules$ = reactantsAndProducts.map((m: string) => this.novostoicService.validateChemical(m));

        combineLatest([
          primaryPrecursor$, 
          targetMolecule$, 
          forkJoin(molecules$)
        ]).subscribe(([
          primaryPrecursor, 
          targetMolecule, 
          molecules
        ]) => {
          input.stoichiometry.reactants.forEach((reactant: { amount: number, molecule: any }) => {
            reactant.molecule = molecules!.find((m: any) => m.metanetx_id === reactant.molecule);
          });

          input.stoichiometry.products.forEach((product: { amount: number, molecule: any }) => {
            product.molecule = molecules!.find((m: any) => m.metanetx_id === product.molecule);
          });

          this.primaryPrecursor$.next(primaryPrecursor);
          this.targetMolecule$.next(targetMolecule);
          this.stoichiometry$.next(input.stoichiometry);

          this.request.addPrimaryPercursorFromMolecule(primaryPrecursor!);
          this.request.addTargetMoleculeFromMolecule(targetMolecule!);
          this.request.addFromStoichiometry(input.stoichiometry);

          this.editing$.next(false);
        });
      } else {
        this.editing$.next(true);
      }
    })
  }

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    if (this.request.isExampleUsed()) {
      this.router.navigate([NovostoicTools.PATHWAY_SEARCH, "result", this.exampleJobId]);
      return;
    }

    this.novostoicService.createJobAndRun(
      JobType.NovostoicPathways,
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.PATHWAY_SEARCH, "result", response.job_id]);
    });
  }

  onNumberInputKeyDown(event: KeyboardEvent) {
    if (event.key === "e" 
      || event.key === "E" 
      || event.key === "-" 
      || event.key === "+"
    ) {
      event.preventDefault();
    }
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
    this.request = PathwaySearchRequest.useExample(this.novostoicService);
  }
}
