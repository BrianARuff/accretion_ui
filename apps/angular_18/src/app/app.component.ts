import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccretionButton } from '@accretion/angular_18';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccretionButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular_18';

  onButtonClick() {
    console.log('Accretion button clicked');
  }
}
