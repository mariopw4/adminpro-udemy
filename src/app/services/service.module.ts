import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, SidebarService, SharedService,UsuarioService, LoginGuardGuard} from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { SubirArchivoService } from './subir-archivo/subir-archivo.service';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { HospitalService } from './hospital/hospital.service';
import { MedicoService } from './medico/medico.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadComponent,
    HospitalService,
    MedicoService
  ]
})
export class ServiceModule { }
