import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccretionButton } from '@accretion_ui/angular_21';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccretionButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular_latest');
}
