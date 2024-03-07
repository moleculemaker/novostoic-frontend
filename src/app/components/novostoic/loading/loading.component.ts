import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { interval, tap, throttle } from "rxjs";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  host: {
    class: "grow",
  },
})
export class LoadingComponent {
  loadingValue$ = interval(200).pipe(
    tap((x) => {
      if (x > 100) {
        this.router.navigate(["/overall-stoichiometry/result"]);
      }
    }),
  );

  constructor(private router: Router) {}
}
