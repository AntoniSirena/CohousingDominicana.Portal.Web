import { Injectable } from '@angular/core';
import { Profile, _Profile } from '../../models/profile/profile';
import { SystemConfiguration } from '../../Templates/systemConfiguration/system-configuration';
import { Person, User } from './../../models/profile/profile';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() {
    this.getProfile();
  }

  profile = new Profile();
  userData = new User();
  personalData = new Person();

  systemConfiguration = new SystemConfiguration();

  getsystemConfiguration(): SystemConfiguration {
    this.systemConfiguration = JSON.parse(localStorage.getItem("systemConfiguration"));
    return this.systemConfiguration;
  }

  getProfile(): Profile {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    return this.profile;
  }

  getUserData(): User {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    return this.userData;
  }

  getPersonalData(): Person {
    this.personalData = JSON.parse(localStorage.getItem("personalData"));
    return this.personalData;
  }

}
