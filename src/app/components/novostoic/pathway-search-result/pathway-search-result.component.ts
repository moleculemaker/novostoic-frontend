import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, filter, first, last, map, of, shareReplay, skipUntil, switchMap, take, takeWhile, tap, throttleTime, timer } from "rxjs";
import { JobType, JobStatus } from "~/app/api/mmli-backend/v1";
import { JobResult } from "~/app/models/job-result";
import { NovostoicMolecule } from "~/app/models/overall-stoichiometry";
import { NovostoicReaction, PathwaySearchResponse } from "~/app/models/pathway-search";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-pathway-search-result",
  templateUrl: "./pathway-search-result.component.html",
  styleUrls: ["./pathway-search-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl w-content-lg xl:mr-64 xl:pr-6'
  }
})
export class PathwaySearchResultComponent extends JobResult {
  override jobId: string = this.route.snapshot.paramMap.get("id") || "";
  override jobType: JobType = JobType.NovostoicPathways;
  
  showRightBoundaryLine$ = new BehaviorSubject(false);
  noResults$ = new BehaviorSubject(false);

  response$ = this.jobResultResponse$.pipe(
    tap((response) => this.noResults$.next(Object.is(response, null))),
    map((response) => response as PathwaySearchResponse),
    map((response) => ({
      ...response,
      pathways: response.pathways.map((pathway) => {
        return {
          id: Math.random().toString(36).substring(7),
          reactions: pathway.map((reaction) => ({
            ...reaction,
            deltaG: {
              gibbsEnergy: Math.round(reaction.deltaG.gibbsEnergy * 100) / 100,
              std: Math.round(reaction.deltaG.std * 10) / 10,
              reaction: reaction.deltaG.reaction,
            },
            products: reaction.products.filter((product) => {
              return product.molecule.name !== reaction.targetMolecule?.name;
            }),
            reactants: reaction.reactants.filter((reactant) => {
              return reactant.molecule.name !== reaction.primaryPrecursor?.name;
            }),
            isThermodynamicalInfeasible: reaction.deltaG.gibbsEnergy > 0,
          }))
        }
      })
    })),
    shareReplay(1),
    tap((data) => console.log('response', data))
  );

  visible: boolean = false;
  highlightPathway: number | null = null;
  selectedPathway: number = 0;
  selectedReactionIdx: number | null = null;

  pathwayDeltaGs$ = this.response$.pipe(
    map((response) => response.pathways.map((pathway) => pathway.reactions.reduce((p, v) => ({
      gibbsEnergy: p.gibbsEnergy + v.deltaG.gibbsEnergy,
      std: p.std + v.deltaG.std,
    }), {
      gibbsEnergy: 0,
      std: 0,
    }))),
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Filters                                  */
  /* -------------------------------------------------------------------------- */
  showResultsFilter$ = new BehaviorSubject(false);

  filterIntermediatesOptions$ = this.response$.pipe(
    map((response) => {
      const intermediates = new Set<string>();
      const returnVal: NovostoicMolecule[] = [];
      response.pathways.forEach((pathway) => {
        pathway.reactions.slice(0, pathway.reactions.length - 1).forEach((reaction) => {
          if (reaction.targetMolecule!.name && reaction.targetMolecule && !intermediates.has(reaction.targetMolecule.name)) {
            intermediates.add(reaction.targetMolecule.name);
            returnVal.push(reaction.targetMolecule);
          }
        });
      });
      return returnVal.map((molecule) => ({
        label: molecule.name,
        value: molecule,
      }));
    }),
  );
  intermediatesFilters$ = new BehaviorSubject<NovostoicMolecule[]>([]);
  filterIntermediatesStr$ = this.intermediatesFilters$.pipe(
    map((filters) => filters.map((filter) => filter.name).join(",")),
  );

  filterCoFactorsOptions$ = this.response$.pipe(
    map((response) => {
      const cofactors = new Set<string>();
      const returnVal: NovostoicMolecule[] = [];
      response.pathways.forEach((pathway) => {
        pathway.reactions.forEach((reaction) => {
          reaction.reactants.forEach((reactant) => {
            if (reactant.molecule.name && !cofactors.has(reactant.molecule.name)) {
              cofactors.add(reactant.molecule.name);
              returnVal.push(reactant.molecule);
            }
          });
          reaction.products.forEach((product) => {
            if (product.molecule.name && !cofactors.has(product.molecule.name)) {
              cofactors.add(product.molecule.name);
              returnVal.push(product.molecule);
            }
          });
        });
      });
      return returnVal.map((molecule) => ({
        label: molecule.name,
        value: molecule,
      }));
    }),
  );
  coFactorsFilters$ = new BehaviorSubject<NovostoicMolecule[]>([]);
  filterCoFactorsStr$ = this.coFactorsFilters$.pipe(
    map((filters) => filters.map((filter) => filter.name).join(",")),
  );

  filtersLength$ = combineLatest([
    this.intermediatesFilters$,
    this.coFactorsFilters$,
  ]).pipe(map(([intermediates, cofactors]) => intermediates.length + cofactors.length));

  selectedThermoFeasibleMode$ = new BehaviorSubject<'all' | 'any' | null>(null);
  feasibleRangeMin$ = new BehaviorSubject<number>(this.novostoicService.thermoFeasibilityFilterMin);
  feasibleRangeMax$ = new BehaviorSubject<number>(this.novostoicService.thermoFeasibilityFilterMax);
  feasibleRange$ = combineLatest([
    this.feasibleRangeMin$,
    this.feasibleRangeMax$,
  ]).pipe(
    map(([min, max]) => [min, max]),
  );

  filteredPathways$ = combineLatest([
    this.response$,
    this.intermediatesFilters$,
    this.coFactorsFilters$,
    this.selectedThermoFeasibleMode$,
    this.feasibleRange$,
  ]).pipe(
    map(([response, intermediates, cofactors, mode, range]) => {
      const intermediatesSet = new Set(intermediates.map((intermediate) => intermediate.name));
      const cofactorsSet = new Set(cofactors.map((cofactor) => cofactor.name));
      return response.pathways.map((pathway) => {
        let intermediatesMatch = false;
        let cofactorsMatch = false;
        let thermodynamicalMatch = true;
        let thermodynamicalRangeMatch = true;
        pathway.reactions.forEach((reaction) => {
          if (reaction.targetMolecule) {
            intermediatesMatch ||= intermediatesSet.size > 0 ? intermediatesSet.has(reaction.targetMolecule.name) : true;
          }
          
          if (cofactorsSet.size) {
            reaction.reactants.forEach((reactant) => {
              cofactorsMatch ||= cofactorsSet.has(reactant.molecule.name);
            });
            reaction.products.forEach((product) => {
              cofactorsMatch ||= cofactorsSet.has(product.molecule.name);
            });
          } else {
            cofactorsMatch = true;
          }

          if (mode && thermodynamicalMatch) {
            thermodynamicalMatch = mode === 'any' 
              ? thermodynamicalMatch && !reaction.isThermodynamicalInfeasible
              : thermodynamicalMatch && reaction.isThermodynamicalInfeasible;
          }
          if (thermodynamicalRangeMatch) {
            thermodynamicalRangeMatch = reaction.deltaG.gibbsEnergy >= range[0] && reaction.deltaG.gibbsEnergy <= range[1];
          }
        });

        if (mode === 'all') {
          thermodynamicalMatch = !thermodynamicalMatch;
        }

        console.log('pathway', pathway, intermediatesMatch, cofactorsMatch, thermodynamicalMatch, thermodynamicalRangeMatch);

        return {
          ...pathway,
          match: intermediatesMatch && cofactorsMatch && thermodynamicalMatch && thermodynamicalRangeMatch,
        }
      }).sort((a, b) => {
        if (a.match && !b.match) {
          return -1;
        }
        if (!a.match && b.match) {
          return 1;
        }
        return 0;
      });
    }),
  );

  /* -------------------------------------------------------------------------- */

  pathwayPredictedReactions$ = this.response$.pipe(
    map((response) => response.pathways.map((pathway) => pathway.reactions.filter((reaction) => reaction.isPrediction))),
  );

  maxPathwayStepsTemplateArray$ = this.filteredPathways$.pipe(
    map((pathways) => {
      const maxPathwaySteps = pathways.reduce(
        (p, v) => Math.max(p, v.reactions.length),
        0,
      );
      const array = [];
      for (let i = 0; i < maxPathwaySteps; i++) {
        array.push(i + 1);
      }
      return array;
    }),
  );

  emptyPathwayHeadersArray$ = this.maxPathwayStepsTemplateArray$.pipe(
    map((x) => x.length),
    map((length) => {
      const lengthNeeded = Math.max(0, 4 - length);
      return new Array(lengthNeeded).fill(0);
    }),
  );

  emptyPathwayStepsArrays$ = combineLatest([
    this.maxPathwayStepsTemplateArray$.pipe(map((x) => x.length)),
    this.filteredPathways$,
  ]).pipe(
    map(([maxArrayLength, pathways]) => {
      let returnVal: Array<Array<number>> = [];
      let maxLength = Math.max(maxArrayLength, 4);
      pathways.forEach((pathway) => {
        const numSlotsNeeded = maxLength - pathway.reactions.length;
        const slots = new Array(numSlotsNeeded * 2).fill(0);
        returnVal.push(slots);
      });
      return returnVal;
    }),
  );

  tableStyle$ = combineLatest([
    this.maxPathwayStepsTemplateArray$.pipe(map((x) => x.length)),
    this.filteredPathways$,
  ]).pipe(
    tap(([maxArrayLength, pathways]) => {
      if (maxArrayLength && pathways.length) {
        this.showRightBoundaryLine$.next(true);
      }
    }),
    map(([maxArrayLength, pathways]) => {
      return {
        height: `${pathways.length * 120}px`,
        width: `${Math.max(maxArrayLength, 4) * 190 - 79.5}px`,
        background:
          "repeat center/1.5rem url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23efefef' opacity='0.5' d='m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z'/%3E%3C/svg%3E\")",
      };
    }),
  );

  constructor(
    protected novostoicService: NovostoicService,
    private route: ActivatedRoute,
  ) {
    super(novostoicService)
  }

  resetFilters() {
    this.intermediatesFilters$.next([]);
    this.coFactorsFilters$.next([]);
    this.feasibleRangeMax$.next(this.novostoicService.thermoFeasibilityFilterMax);
    this.feasibleRangeMin$.next(this.novostoicService.thermoFeasibilityFilterMin);
    this.selectedThermoFeasibleMode$.next(null);
  }

  applyFilters() {
    this.showResultsFilter$.next(false);
  }

  getEnzymeObj(enzyme: any) {
    return <NovostoicReaction['enzymes'][0]>(enzyme);
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
