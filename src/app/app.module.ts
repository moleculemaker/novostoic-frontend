import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ButtonModule } from "primeng/button";
import { InputTextareaModule } from "primeng/inputtextarea";
import { PanelModule } from "primeng/panel";
import { PrimeIcons } from "primeng/api";
import { ProgressBarModule } from "primeng/progressbar";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { StepsModule } from "primeng/steps";
import { TableModule } from "primeng/table";
import { FileUploadModule } from "primeng/fileupload";
import { MessagesModule } from "primeng/messages";
import { DropdownModule } from "primeng/dropdown";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ListboxModule } from "primeng/listbox";
import { InputTextModule } from "primeng/inputtext";
import { SidebarModule } from "primeng/sidebar";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from "primeng/card";
import { ChipModule } from "primeng/chip";
import { TabViewModule } from "primeng/tabview";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { MultiSelectModule } from "primeng/multiselect";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { SliderModule } from "primeng/slider";

import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { SidebarComponent } from "./components/novostoic/sidebar/sidebar.component";
import { OverallStoichiometryComponent } from "./components/novostoic/overall-stoichiometry/overall-stoichiometry.component";
import { AboutNovostoicComponent } from "./components/novostoic/about-novostoic/about-novostoic.component";
import { MarvinJsModule } from "./components/novostoic/marvinjs/marvinjs.module";
import { MarvinjsInputComponent } from "./components/novostoic/marvinjs-input/marvinjs-input.component";

// import { ConfigurationComponent} from './components/chemscraper/configuration/configuration.component';
// import { ResultsComponent } from './components/chemscraper/results/results.component';

// import { ChemScraperService } from './chemscraper.service';
import { HttpClientModule } from "@angular/common/http";
import { NgxMatomoTrackerModule } from "@ngx-matomo/tracker";
import { NgxMatomoRouterModule } from "@ngx-matomo/router";
// import { FileDragNDropDirective } from './components/chemscraper/configuration/file-drag-n-drop.directive';
// import { PdfViewerComponent } from './components/chemscraper/pdf-viewer/pdf-viewer.component';
// import { PdfViewerDialogServiceComponent } from './components/chemscraper/pdf-viewer-dialog-service/pdf-viewer-dialog-service.component';

import { EnvironmentService } from "@services/environment.service";
import { MenuModule } from "primeng/menu";
// import { MarvinJsModule } from "./components/chemscraper/marvinjs/marvinjs.module";
import { DialogModule } from "primeng/dialog";
// import { ExportMenuComponent } from './components/chemscraper/results/export-menu/export-menu.component';
// import { PdfContextViewerComponent } from './components/chemscraper/results/pdf-context-viewer/pdf-context-viewer.component';

import { ApiModule, Configuration } from "@api/mmli-backend/v1";
import { SafePipe } from "./pipes/safe.pipe";
import { OverallStoichiometryResultComponent } from "./components/novostoic/overall-stoichiometry-result/overall-stoichiometry-result.component";
import { LoadingComponent } from "./components/novostoic/loading/loading.component";
import { EnzRankComponent } from './components/novostoic/enz-rank/enz-rank.component';
import { EnzRankResultComponent } from './components/novostoic/enz-rank-result/enz-rank-result.component';
import { PathwaySearchComponent } from "./components/novostoic/pathway-search/pathway-search.component";
import { StoichiometryReactionComponent } from "./components/novostoic/stoichiometry-reaction/stoichiometry-reaction.component";
import { PathwaySearchResultComponent } from "./components/novostoic/pathway-search-result/pathway-search-result.component";
import { StoichiometryReactionWithScrollerComponent } from './components/novostoic/stoichiometry-reaction-with-scroller/stoichiometry-reaction-with-scroller.component';
import { DgPredictorComponent } from "./components/novostoic/dg-predictor/dg-predictor.component";
import { DgPredictorResultComponent } from './components/novostoic/dg-predictor-result/dg-predictor-result.component';
import { MainLayoutComponent } from './components/novostoic/main-layout/main-layout.component';
import { CenterLayoutComponent } from './components/novostoic/center-layout/center-layout.component';
import { MoleculeImageComponent } from './components/novostoic/molecule-image/molecule-image.component';
import { ChemicalInputComponent } from './components/novostoic/chemical-input/chemical-input.component';

const initAppFn = (envService: EnvironmentService) => {
  return () => envService.loadEnvConfig("/assets/config/envvars.json");
};

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,

    LandingPageComponent,
    OverallStoichiometryComponent,
    SidebarComponent,
    AboutNovostoicComponent,
    OverallStoichiometryResultComponent,
    LoadingComponent,
    DgPredictorComponent,
    DgPredictorResultComponent,
    MarvinjsInputComponent,
    EnzRankComponent,
    EnzRankResultComponent,
    PathwaySearchComponent,
    StoichiometryReactionComponent,
    PathwaySearchResultComponent,
    StoichiometryReactionWithScrollerComponent,
    MainLayoutComponent,
    CenterLayoutComponent,
    MoleculeImageComponent,
    ChemicalInputComponent,
    // FileDragNDropDirective,
    // ConfigurationComponent,
    // ResultsComponent,
    // PdfViewerComponent,
    // PdfViewerDialogServiceComponent,
    // ExportMenuComponent,
    // PdfContextViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MessagesModule,
    ButtonModule,
    CardModule,
    ChipModule,
    InputTextareaModule,
    InputNumberModule,
    PanelModule,
    ProgressBarModule,
    SelectButtonModule,
    SkeletonModule,
    ScrollPanelModule,
    SliderModule,
    ProgressSpinnerModule,
    StepsModule,
    SliderModule,
    DropdownModule,
    TableModule,
    TabViewModule,
    InputTextModule,
    InputSwitchModule,
    ListboxModule,
    OverlayPanelModule,
    SidebarModule,
    RadioButtonModule,
    CheckboxModule,
    FileUploadModule,
    PanelModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxMatomoTrackerModule.forRoot({
      siteId: 7,
      trackerUrl: "https://matomo.mmli1.ncsa.illinois.edu/",
    }),
    NgxMatomoRouterModule,
    MenuModule,
    MultiSelectModule,

    ApiModule.forRoot(() => new Configuration()),
    ReactiveFormsModule,
    MarvinJsModule,
    DialogModule,
  ],
  providers: [
    // ChemScraperService,
    EnvironmentService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFn,
      multi: true,
      deps: [EnvironmentService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
