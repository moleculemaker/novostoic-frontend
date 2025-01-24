import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterService } from "primeng/api";
import { Table } from "primeng/table";
import { Subscription, map, tap, take } from "rxjs";

import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { JobType } from "~/app/api/mmli-backend/v1";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
  OverallStoichiometryResponse,
} from "~/app/models/overall-stoichiometry";
import { NovostoicService } from "~/app/services/novostoic.service";
import { JobResult } from "~/app/models/job-result";

@Component({
  selector: "app-overall-stoichiometry-result",
  templateUrl: "./overall-stoichiometry-result.component.html",
  styleUrls: ["./overall-stoichiometry-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class OverallStoichiometryResultComponent extends JobResult implements OnInit {
  @ViewChild("resultsTable") resultsTable: Table;

  override jobId: string = this.route.snapshot.paramMap.get("id") || "";
  override jobType: JobType = JobType.NovostoicOptstoic;

  cofactorOptions: { value: NovostoicMolecule, label: string }[] = [];
  selectedCofactors: NovostoicMolecule[] = [];
  selectedCofactorsLabel: string = "Select cofactors";

  response$ = this.jobResultResponse$.pipe(
    map((response) => response as OverallStoichiometryResponse),
    tap((response) => {
      response.results.forEach((result) => {
        result.deltaG = parseFloat(result.deltaG as unknown as string);
      });

      // build options for filter
      const moleculeSet = new Set();
      const buildOptions = (molecules: NovostoicMolecule[]) => {
        const options: { value: NovostoicMolecule, label: string }[] = [];
        molecules.forEach((molecule) => {
          if (!moleculeSet.has(molecule.kegg_id) 
            || !moleculeSet.has(molecule.name)
            || !moleculeSet.has(molecule.smiles)
          ) {
            options.push({
              value: molecule,
              label: molecule.name || molecule.kegg_id || molecule.smiles || "Unknown",
            });
          }
  
          moleculeSet.add(molecule.kegg_id);
          moleculeSet.add(molecule.name);
          moleculeSet.add(molecule.smiles);
        });

        return options;
      };

      this.cofactorOptions = buildOptions(
        [
          ...response.results.flatMap((result) => result.stoichiometry.products.map((product) => product.molecule)),
          ...response.results.flatMap((result) => result.stoichiometry.reactants.map((reactant) => reactant.molecule)),
        ]
      );
    })
  );

  showResultsFilter = false;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private novostoicService: NovostoicService,
  ) {
    super(novostoicService);
  }

  ngOnInit(): void {
    this.filterService.register(
      "containsMolecule",
      (
        value: OverallStoichiometryResponse["results"][0]["stoichiometry"],
        filter: NovostoicMolecule[],
      ) => {
        const isSameMolecule = (m1: NovostoicMolecule, m2: NovostoicMolecule) =>
          m1.smiles === m2.smiles ||
          m1.kegg_id === m2.kegg_id ||
          m1.name === m2.name;
        return (
          value.reactants.some(({ molecule }) =>
            filter.some((m) => isSameMolecule(m, molecule)),
          ) ||
          value.products.some(({ molecule }) =>
            filter.some((m) => isSameMolecule(m, molecule)),
          )
        );
      },
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  enterPathwayDesignByClick(stoichiometry: NovostoicStoichiometry) {
    this.subscriptions.push(
      this.response$.pipe(take(1)).subscribe((response) => {
        const state = {
          primaryPrecursor: response.primaryPrecursor.metanetx_id,
          targetMolecule: response.targetMolecule.metanetx_id,
          stoichiometry: {
            products: stoichiometry.products.map((product) => ({ 
              amount: product.amount, 
              molecule: product.molecule.metanetx_id,
            })),
            reactants: stoichiometry.reactants.map((reactant) => ({ 
              amount: reactant.amount, 
              molecule: reactant.molecule.metanetx_id,
            })),
          },
        };
        const stateStr = encodeURIComponent(JSON.stringify(state));
        const url = this.router.serializeUrl(this.router.createUrlTree([NovostoicTools.PATHWAY_SEARCH], { queryParams: { input: stateStr } }));
        window.open(url, "_blank");
      })
    );
  }

  updateSelectedCofactorsLabel() {
    this.selectedCofactorsLabel = this.selectedCofactors.map((cofactor) => 
      cofactor.name || cofactor.kegg_id || cofactor.smiles || "Unknown"
    ).join(", ");
  }

  applyFilters() {
    this.resultsTable.filter(
      this.selectedCofactors,
      "stoichiometry",
      "containsMolecule",
    );
  }

  copyAndPasteURL(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
