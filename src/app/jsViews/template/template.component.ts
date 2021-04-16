import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateService } from '../../services/template/template.service';
import { Template } from '../../models/template/template';
import { Itemplate } from '../../interfaces/Itemplate/itemplate';
import { Iresponse } from '../../interfaces/Iresponse/iresponse';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
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
export class TemplateComponent implements OnInit {

  editTemplateForm: FormGroup;

  _currentPage: number = 1;

  templates = new Array<Template>();
  template = new Template();
  
  
  //constructor
  constructor(
    private templateService: TemplateService,
    private modalService: NgbModal,
    private form: FormBuilder) {
  }


  ngOnInit() {
    this.getTemplates();
  }



  getTemplates() {
    this.templateService.getTemplates().subscribe((response: Array<Template>) => {
      this.templates = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getTemplateById(editModal, id: number) {
    this.templateService.getTemplateById(id).subscribe((response: Template) => {
      this.template = response;

      //llenando el modal
      this.editTemplateForm = this.form.group({
        id: [`${this.template.Id}`, Validators.required],
        operation: [`${this.template.Operation}`],
        shortName: [`${this.template.ShortName}`, Validators.required],
        name: [`${this.template.Name}`, Validators.required],
        description: [`${this.template.Description}`, Validators.required],
        body: [this.template.Body, Validators.required],
        enabled: [this.template.Enabled],
      });

      this.modalService.open(editModal, { size: 'xl', backdrop: 'static' });

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  cleanTemplateBody(){
    
  }
  
  enabled(flag: number) {
    if(flag === 1){
      this.template.Enabled = true;
    }else{
      this.template.Enabled = false;
    }
  }

  //open edit modal
  openEditModal(editModal, id: number) {
    this.setValueEditFrom();
    this.getTemplateById(editModal, id);
  }

  //edit
  edit(formValue: any) {

    const template: Itemplate = {
      Id: this.template.Id,
      Description: formValue.description,
      ShortName: formValue.shortName,
      Operation: formValue.operation,
      Name: formValue.name,
      Body: formValue.body,
      Enabled: formValue.enabled,
      CreationTime: this.template.CreationTime,
      CreatorUserId: this.template.CreatorUserId,
      LastModificationTime: this.template.LastModificationTime,
      LastModifierUserId: this.template.LastModifierUserId,
      DeleterUserId: this.template.DeleterUserId,
      DeletionTime: this.template.DeletionTime,
      IsActive: this.template.IsActive,
      IsDeleted: this.template.IsDeleted
    };

    this.templateService.editTemplate(template).subscribe((response: Iresponse) => {
      if (response.Code === '000') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.Message,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.getTemplates();
          this.modalService.dismissAll();
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


  //edit from set value ''
  setValueEditFrom() {
    this.editTemplateForm = this.form.group({
      id: [0, Validators.required],
      operation: [''],
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      description: ['', Validators.required],
      body: ['', Validators.required],
      enabled: [false]
    });
  }

}
