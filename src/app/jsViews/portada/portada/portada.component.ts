import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import $ from 'jquery';


import { Router } from '@angular/router';
import { PortadaService } from '../../../services/portada/portada.service';
import { Iresponse } from '../../../interfaces/Iresponse/iresponse';
import { Portada } from '../../../models/portada/portada';
import { NoveltiesByType } from '../../../models/novelty/novelty';
import { CommonService } from './../../../services/common/common.service';
import { RedirectService } from './../../../services/redirect/redirect.service';
import { environment } from '../../../environments/environment';
import { SizeImageNovelty } from './../../../configurations/jsConfig';


@Component({
  selector: 'app-portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.css'],
  providers: [NgbCarouselConfig],
  encapsulation: ViewEncapsulation.None,
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
export class PortadaComponent implements OnInit {


  showNavigationArrows = false;
  showNavigationIndicators = false;

  images_A: any;

  images_B: any;

  images_C: any;

  isLogin: Boolean = false;

  @ViewChild('misionModal') misionModal: ElementRef;
  @ViewChild('visionModal') visionModal: ElementRef;
  @ViewChild('valoresModal') valoresModal: ElementRef;
  @ViewChild('automaticPublicityModal') automaticPublicityModal: ElementRef;
  @ViewChild('historiaModal') historiaModal: ElementRef;
  @ViewChild('contactosModal') contactosModal: ElementRef;
  @ViewChild('preguntasFrecuentesModal') preguntasFrecuentesModal: ElementRef;
  @ViewChild('secciónAModal') secciónAModal: ElementRef;
  @ViewChild('secciónBModal') secciónBModal: ElementRef;


  coreURL = environment.coreURL;
  img_Width = SizeImageNovelty.width;
  img_height = SizeImageNovelty.height;

  automaticPublicityValue: any;
  automaticPublicityTime: number;
  automaticPublicityTemplates: any;
  isEnabled_AutomaticPublicity: boolean;
  currentOperation: any;
  currentOperationPosition: number = 0;

  portada = new Portada();
  automaticPublicityPortada = new Portada();

  secciónA = new Portada();
  secciónB = new Portada();

  bannerA = new Portada();

  novelties = new Array<NoveltiesByType>();

  constructor(
    config: NgbCarouselConfig,
    private commonService: CommonService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private portadaService: PortadaService,
    private redirectService: RedirectService) {

    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;

  }


  ngOnInit(): void {

    if (localStorage.length <= 5) {
      this.redirectService.loginUserVisitador();
      return;
    }

    this.loadingPortada();
    this.openDefaultMenu();

    //AutomaticPublicity
    this.isEnabledAutomaticPublicity('IsEnabled_AutomaticPublicity');

  }


  //open default menu
  openDefaultMenu() {
    $('#btnMenu').trigger('click');
  }

  ///loading
  loadingPortada() {
    this.getCarousel_Images_A('Carousel_Images_A_Portada');

    setTimeout(() => {
      this.spinnerService.hide();
      this.getSecciónA('SecciónA');
      this.getSecciónB('SecciónB');
    }, 1000);
  }


  inProcess() {
    alert('Funcionalidad en proceso');
  }

  //Is Enabled Automatic Publicity
  isEnabledAutomaticPublicity(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.isEnabled_AutomaticPublicity = response;

      if (this.isEnabled_AutomaticPublicity) {
        this.getAutomaticPublicityTemplates('AutomaticPublicityTemplates');
        this.getTimeAutomaticPublicity('AutomaticPublicityTime');
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //Get Time Automatic Publicity
  getTimeAutomaticPublicity(name: string): any {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.automaticPublicityTime = response;
      this.getAutomaticPublicity();
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //Get Automatic Publicity
  getAutomaticPublicity() {
    setInterval(() => {

      if (location.hash.match('portada')) {
        this.currentOperation = this.automaticPublicityTemplates[this.currentOperationPosition];

        this.openAutomaticPublicityModal(this.currentOperation);

        if (this.currentOperationPosition === this.automaticPublicityTemplates.length - 1) {
          this.currentOperationPosition = 0;
        } else {
          this.currentOperationPosition += 1;
        }
      }

    }, this.automaticPublicityTime);

  }


  //Get Automatic Publicity Templates
  getAutomaticPublicityTemplates(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.automaticPublicityTemplates = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //Get Carousel_Images_A
  getCarousel_Images_A(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.images_A = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  //Get Carousel_Images_B
  getCarousel_Images_B(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.images_B = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  //Get Carousel_Images_C
  getCarousel_Images_C(name: string) {
    this.commonService.getConfigurationParameter(name).subscribe((response: any) => {
      this.images_C = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //Get template
  getTemplate(operation: string) {

    this.portadaService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.portada = response.Data;
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


  //Get automatic publicity template
  getAutomaticPublicityTemplate(operation: string) {

    this.portadaService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.automaticPublicityPortada = response.Data;
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

  //Get SecciónA
  getSecciónA(operation: string) {
    this.portadaService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.secciónA = response.Data;
        $("#secciónA").html(this.secciónA.Body);
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

  //Get SecciónB
  getSecciónB(operation: string) {
    this.portadaService.getTemplateByOperation(operation).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        this.secciónB = response.Data;
        $("#secciónB").html(this.secciónB.Body);
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


  //open automatic publicity modal
  openAutomaticPublicityModal(operation: string) {
    this.getAutomaticPublicityTemplate(operation);

    this.modalService.dismissAll();

    this.modalService.open(this.automaticPublicityModal, { size: 'lg', scrollable: true, backdrop: 'static' });
  }


  //open misión modal
  openMisionModal(operation: string) {
    this.getTemplate(operation);
    this.modalService.open(this.misionModal, { size: 'lg', scrollable: true, backdrop: 'static' });
  }

  //open visión modal
  openVisionModal(operation: string) {
    this.getTemplate(operation);
    this.modalService.open(this.visionModal, { size: 'lg', scrollable: true, backdrop: 'static' });
  }

  //open valores modal
  openValoresModal(operation: string) {
    this.getTemplate(operation);
    this.modalService.open(this.valoresModal, { size: 'lg', scrollable: true, backdrop: 'static' });
  }


  //open historia modal
  openHistoriaModal(operation: string) {
    this.getTemplate(operation);
    this.modalService.open(this.historiaModal, { size: 'xl', scrollable: true, backdrop: 'static' });
  }

  //open historia contactos
  openContactosModal(operation: string) {
    this.getTemplate(operation);
    this.modalService.open(this.contactosModal, { size: 'lg', scrollable: true, backdrop: 'static' });
  }


  //open preguntas frecuentes modal
  openPreguntasFrecuentesModal(operation: string) {
    this.getTemplate(operation);
    this.modalService.open(this.preguntasFrecuentesModal, { size: 'xl', scrollable: true, backdrop: 'static' });
  }


}
