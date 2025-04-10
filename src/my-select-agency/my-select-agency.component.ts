/* import { Component } from '@angular/core';
//import { AuthenticationService } from '../../services/authentication/authentication.service';
//import { Agency } from 'src/lib/features/login/domain/models/agency/agency';

@Component({
  selector: 'my-select-agency',
  templateUrl: './my-select-agency.html',
  styleUrls: ['./my-select-agency.scss'],
})
export class MySelectAgencyComponent {
  public currentAgency: Agency = this.authenticationService.getCurrentAgency() as Agency;

  constructor(public authenticationService: AuthenticationService) {
  }

  onValueChanged(value: Agency) {
    this.authenticationService.setCurrentAgency(value);
  }
}
*/ 