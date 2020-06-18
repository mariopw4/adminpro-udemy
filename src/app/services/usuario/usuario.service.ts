import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router, public _sa: SubirArchivoService) { 
    this.cargarStorage();
  }

  guardarStorage(id: string, token: string, usuario: Usuario){
    localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuario = usuario;
      this.token = token;
  }

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recuerdame: boolean = false){
    if(recuerdame){
      localStorage.setItem('email', usuario.email);
    }else{
      localStorage.removeItem('email');
    }
    return this.http.post(URL_SERVICIOS+'/login', usuario)
    .pipe(map( (resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    }));
  }

  loginGoogle(token: string){
    return this.http.post(URL_SERVICIOS+'/login/google', {token})
    .pipe(map( (resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    }));
  }

  estaLogueado(){
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }
  }

  crearUsuario(usuario: Usuario){
    return this.http.post(URL_SERVICIOS+'/usuario', usuario)
        .pipe(map( (resp: any) => {
            Swal.fire('Usuario creado', usuario.email, 'success');
            return resp.usuario;
        }));
  }

  actualizarUsuario(usuario: Usuario){
    return this.http.put(URL_SERVICIOS+'/usuario/'+this.usuario._id+'?token='+this.token, usuario)
    .pipe(map((resp: any) => {
      Swal.fire('Usuario actualizado', usuario.nombre, 'success');
      this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
      return true;
    }));
  }

  cambiarImagen(archivo: File, id: string){
    this._sa.subirArchivo(archivo, 'usuarios', id)
    .then((resp: any) => {
      this.usuario.img = resp.usuario.img;
      Swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
    }).catch(resp => {
      console.log(resp);
    });
  }
  
}
