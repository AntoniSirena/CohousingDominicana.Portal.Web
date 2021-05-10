import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BaseService } from '../../../services/base/base.service';
import { ProfileService } from '../../../services/profile/profile.service';

import { Gender, Profile, _Profile } from '../../../models/profile/profile';
import { LocatorsTypes } from '../../../models/profile/profile';
import { InfoCurrentUser } from '../../../models/profile/profile';
import { InfoCurrentPerson } from '../../../models/profile/profile';
import { InfoCurrentLocators } from '../../../models/profile/profile';
import { Iresponse } from '../../../interfaces/Iresponse/iresponse';
import Swal from 'sweetalert2';
import { Locator } from '../../../models/locator/locator';
import { LocatorService } from '../../../services/locator/locator.service';
import { Ilocator } from '../../../interfaces/Ilocator/ilocator';
import { DocumentType } from '../../../models/common/documentType/document-type';
import { CommonService } from '../../../services/common/common.service';

import { FileReaderPromiseLikeService, FileReaderObservableLikeService } from 'fctrlx-angular-file-reader';
import { RedirectService } from '../../../services/redirect/redirect.service';
import { Ilogin } from '../../../interfaces/Ilogin/ilogin';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    FileReaderPromiseLikeService,
    FileReaderObservableLikeService
  ],
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]
})
export class ProfileComponent implements OnInit {

  isVisitorUser: boolean = JSON.parse(localStorage.getItem("isVisitorUser")) || false;

  //constructor
  constructor(
    private redirectService: RedirectService,
    private modalService: NgbModal,
    private baseService: BaseService,
    private profileService: ProfileService,
    private locatorService: LocatorService,
    private commonService: CommonService,
    private form: FormBuilder,
    private obsLikeService: FileReaderObservableLikeService,
    private promiseService: FileReaderPromiseLikeService
  ) {

    //Cagando la data desde el servidor
    if(!this.isVisitorUser && localStorage.length > 0){
      this.profile = this.baseService.getProfile();
      
      setTimeout(() => {
        this.getGenders();
        this.getDocumentTypes();
        this.getInfoCurrentUser();
        this.getInfoCurrentPerson();
        this.getLocatorsTypes();
        this.getInfoCurrentLocators();
      }, 10000);
    }

    if(localStorage.length === 0){
      this.redirectService.loginUserVisitador();
    }

  }


  //Variables
  @ViewChild('content') _content: ElementRef;

  _currentPage: number = 1;

  genders = new Gender();
  locatorsTypes = new LocatorsTypes();
  infoCurrentUser = new InfoCurrentUser();
  infoCurrentPerson = new InfoCurrentPerson();
  infoCurrentLocators = new InfoCurrentLocators();
  locator = new Locator();
  profile = new Profile();
  documentTypes = new Array<DocumentType>();

  userForm: FormGroup;
  personForm: FormGroup;
  createLocatorForm: FormGroup;
  editLocatorForm: FormGroup;

  inputFiles: any = '';

  imgProfile: string = '';
  imgProfileOriginServer: boolean = true;

  buttonUpdateUserImg: boolean;

  //Init
  ngOnInit(): void {
    this.buttonUpdateUserImg = true;

    this.setValueEditPersonFrom();
    this.setValueCreatePersonFrom();
    this.setValueEditFrom();
    this.setValueCreateFrom();
    this.setValueCreateLocatorFrom();
  }


  //Se ejecuta después que el DOM finaliza un operación
  ngAfterViewChecked() {
    this.setProfileImg();
  }


  openProfileModal() {

    //abriendo el modal
    this.modalService.open(this._content, { size: 'lg', scrollable: true })

    //Llenando los input del tab usuario
    this.userForm = this.form.group({
      userName: [`${this.infoCurrentUser.UserName}`, Validators.required],
      password: [`${this.infoCurrentUser.Password}`, [Validators.required, Validators.minLength(8)]],
      name: [`${this.infoCurrentUser.Name}`, Validators.required] || '',
      surName: [`${this.infoCurrentUser.SurName}`, Validators.required] || '',
      emailAddress: [`${this.infoCurrentUser.EmailAddress}`, [Validators.required, Validators.email]],
      phoneNumber: [`${this.infoCurrentUser.PhoneNumber}`, Validators.required] || '',
    });

    //Llenando los input del tab persona
    this.personForm = this.form.group({
      firstName: [`${this.infoCurrentPerson.FirstName}`, Validators.required] || '',
      secondName: [`${this.infoCurrentPerson.SecondName}`],
      surName: [`${this.infoCurrentPerson.SurName}`, Validators.required],
      secondSurname: [`${this.infoCurrentPerson.SecondSurname}`] || '',
      fullName: [`${this.infoCurrentPerson.FullName}`],
      birthDate: [`${this.infoCurrentPerson.BirthDate}`, Validators.required],
      genderId: [`${this.infoCurrentPerson.GenderId}`, Validators.required],
      documentTypeId: [`${this.infoCurrentPerson.DocumentTypeId}`],
      documentNumber: [`${this.infoCurrentPerson.DocumentNumber}`]
    });
  }

  getGenders() {
    this.profileService.getGenders().subscribe((response: Gender) => {
      this.genders = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getDocumentTypes() {
    this.commonService.getDocumentTypes().subscribe((response: Array<DocumentType>) => {
      this.documentTypes = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getLocatorsTypes() {
    this.profileService.getLocatorsTypes().subscribe((response: LocatorsTypes) => {
      this.locatorsTypes = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getInfoCurrentUser() {
    this.profileService.getInfoCurrentUser().subscribe((response: InfoCurrentUser) => {
      this.infoCurrentUser = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getInfoCurrentPerson() {
    this.profileService.getInfoCurrentPerson().subscribe((response: InfoCurrentPerson) => {
      this.infoCurrentPerson = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getInfoCurrentLocators() {
    this.profileService.getInfoCurrentLocators().subscribe((response: InfoCurrentLocators) => {
      this.infoCurrentLocators = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  currentUserOnSubmit(formValue: any) {
    const infoCurrentUser = new InfoCurrentUser();
    infoCurrentUser.UserName = formValue.userName,
      infoCurrentUser.Password = formValue.password,
      infoCurrentUser.Name = formValue.name,
      infoCurrentUser.SurName = formValue.surName,
      infoCurrentUser.EmailAddress = formValue.emailAddress,
      infoCurrentUser.PhoneNumber = formValue.phoneNumber,

      this.profileService.updateInfoCurrentUser(infoCurrentUser).subscribe((response: Iresponse) => {

        if (response.Code === '000') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.Message,
            showConfirmButton: true,
            timer: 3000
          }).then(() => {
            this.getInfoCurrentUser();
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: response.Message,
            showConfirmButton: true,
            timer: 4000
          });
        }

      },
        error => {
          console.log(JSON.stringify(error));
        });
  }


  currentPersonOnSubmit(formValue: any) {

    const infoCurrentPerson = new InfoCurrentPerson();
    infoCurrentPerson.FirstName = formValue.firstName,
      infoCurrentPerson.SurName = formValue.surName,
      infoCurrentPerson.SecondName = formValue.secondName,
      infoCurrentPerson.SecondSurname = formValue.secondSurname,
      infoCurrentPerson.FullName = formValue.fullName,
      infoCurrentPerson.BirthDate = formValue.birthDate,
      infoCurrentPerson.GenderId = formValue.genderId,
      infoCurrentPerson.DocumentTypeId = formValue.documentTypeId,
      infoCurrentPerson.DocumentNumber = formValue.documentNumber

    this.profileService.updateInfoCurrentPerson(infoCurrentPerson).subscribe((response: Iresponse) => {

      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 3000
        }).then(() => {
          this.getInfoCurrentPerson();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 4000
        });
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //upload file
  uploadFile(event) {
    this.imgProfileOriginServer = false;
  }

  //set Img Profile
  setProfileImg() {
    if (this.inputFiles !== '') {
      if(this.inputFiles.length > 0){
        this.imgProfile = this.inputFiles[0].base64;
      }
    }
  }

  //update Img Profile
  updateProfileImg() {
    this.buttonUpdateUserImg = false;

    this.profileService.updateProfileImagen(this.imgProfile).subscribe((response: Iresponse) => {
      this.buttonUpdateUserImg = true;
      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 3000
        }).then(() => {
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 4000
        });
      }
    },
      error => {
        this.buttonUpdateUserImg = true;
        console.log(JSON.stringify(error));
      });
  }


  setValueEditPersonFrom() {
    this.personForm = this.form.group({
      firstName: ['', Validators.required],
      secondName: ['',],
      surName: ['', Validators.required],
      secondSurname: ['',],
      fullName: [''],
      birthDate: ['', Validators.required],
      genderId: ['', Validators.required],
      documentTypeId: [''],
      documentNumber: ['']
    });
  }

  setValueCreatePersonFrom() {
    this.personForm = this.form.group({
      firstName: ['', Validators.required],
      secondName: ['',],
      surName: ['', Validators.required],
      secondSurname: ['',],
      fullName: [''],
      birthDate: ['', Validators.required],
      genderId: ['', Validators.required],
      documentTypeId: ['', Validators.required],
      documentNumber: ['', Validators.required]
    });
  }

  //edit from set value ''
  setValueEditFrom() {
    this.userForm = this.form.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', Validators.required],
      surName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]]
    });
  }

  //create from set value ''
  setValueCreateFrom() {
    this.userForm = this.form.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', Validators.required],
      surName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]]
    });
  }



  //open create locator modal
  openCreateLocatorModal(createLocatorModal) {
    this.setValueCreateLocatorFrom();
    this.modalService.open(createLocatorModal, { size: 'lg', backdrop: 'static', scrollable: true });
  }

  //open edit modal
  openEditLocatorModal(editLocatorModal, id: number) {
    this.getLocatorById(id);
    this.getLocatorsTypes();
    this.setValueEditLocatorFrom();
    this.modalService.open(editLocatorModal, { size: 'lg', backdrop: 'static', scrollable: true });
  }

  //Get Locator by Id
  getLocatorById(id: number) {
    this.locatorService.getLocatorById(id).subscribe((response: Locator) => {
      this.locator = response;

      //llenando el modal
      this.editLocatorForm = this.form.group({
        id: [this.locator.Id],
        locatorTypeId: [this.locator.LocatorTypeId, Validators.required],
        description: [`${this.locator.Description}`, Validators.required],
        isMain: [this.locator.IsMain],
      });
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  isMainTrue() {
    this.locator.IsMain = true;
  }

  isMainFalse() {
    this.locator.IsMain = false;
  }

  //create locator
  createLocator(formValue: any) {
    const locator: Ilocator = {
      Id: 0,
      PersonId: 0,
      LocatorTypeId: formValue.locatorTypeId,
      Description: formValue.description,
      IsMain: this.locator.IsMain,
      IsActive: true,
      IsDeleted: false,
      CreatorUserId: null,
      CreationTime: null,
      LastModifierUserId: null,
      LastModificationTime: null,
      DeleterUserId: null,
      DeletionTime: null
    }

    this.locatorService.createLocator(locator).subscribe((response: Iresponse) => {

      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 3000
        }).then(() => {
          this.getInfoCurrentLocators();
          this.setValueCreateLocatorFrom();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 4000
        });
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //edit locator
  editLocator(formValue: any) {
    const locator: Ilocator = {
      Id: this.locator.Id,
      PersonId: this.locator.PersonId,
      LocatorTypeId: formValue.locatorTypeId,
      Description: formValue.description,
      IsMain: this.locator.IsMain,
      IsActive: this.locator.IsActive,
      IsDeleted: this.locator.IsDeleted,
      CreatorUserId: this.locator.CreatorUserId,
      CreationTime: this.locator.CreationTime,
      LastModifierUserId: this.locator.LastModifierUserId,
      LastModificationTime: this.locator.LastModificationTime,
      DeleterUserId: this.locator.DeleterUserId,
      DeletionTime: this.locator.DeletionTime
    }

    this.locatorService.editLocator(locator).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.getInfoCurrentLocators();
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.Message,
          showConfirmButton: true,
          timer: 3000
        });
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });

  }


  //delete locator
  deleteLocator(id: number) {

    Swal.fire({
      title: 'Esta seguro que desea eliminar el registro ?',
      text: "Los cambios no podran ser revertidos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        //delete service
        this.locatorService.deleteLocator(id).subscribe((response: Iresponse) => {
          if (response.Code === '000') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: response.Message,
              showConfirmButton: true,
              timer: 2000
            }).then(() => {
              this.getInfoCurrentLocators();
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: response.Message,
              showConfirmButton: true,
              timer: 3000
            });
          }
        },
          error => {
            console.log(JSON.stringify(error));
          });

      }
    })
  }


  //create locator from set value ''
  setValueCreateLocatorFrom() {
    this.createLocatorForm = this.form.group({
      locatorTypeId: ['', Validators.required],
      description: ['', Validators.required],
      isMain: [false],
    });
  }

  //edit locator from set value ''
  setValueEditLocatorFrom() {
    this.editLocatorForm = this.form.group({
      locatorTypeId: ['', Validators.required],
      description: ['', Validators.required],
      isMain: [false],
    });
  }

}
