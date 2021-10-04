import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { AppState } from '../app.state';
import { AuthService } from '../auth/auth.service';
import { Login } from '../store/user/user.actions';
import { User } from '../store/user/user.model';
import { userSelector } from '../store/user/user.selector';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http'


interface ReponseLogin{
  id: string
  employeeCode:string
}

interface Employeedisplay{
  code:string
  name : string
  last_name_f: string
  last_name_m: string
}

interface GetAsistencia{
  id: string
  entry_date: string
  entry_time: string
}

const initialStateGetAsistencia: GetAsistencia ={
  id:'',
  entry_date:'',
  entry_time: ''
}

const initialStateEmployee: Employeedisplay ={
  code:'',
  name:'',
  last_name_f:'',
  last_name_m:'',
}

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  /* varibles para marcar salida */
  employee: Employeedisplay = initialStateEmployee
  datasalida: GetAsistencia = initialStateGetAsistencia
  statusSalida:boolean= false
  statusMarcar :boolean=  false
  statusError :boolean= false
  statusEmployee : boolean=  false
  error: string = '';


  /* login status */
  isLoggedIn$:Observable<boolean> = this.store.select(userSelector).pipe(map((user)=>{
    return user.isLoading
  }))

  /* redux user status */
  user$: Observable<User> = this.store.select(userSelector).pipe(map((user) => {
    console.log(user);
    return user
  }))

  /* form */
  formLogin = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  formAsistencia =  this.fb.group({
    code: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private store: Store<AppState>,
    private http: HttpClient,) {
  }

  ngOnInit(): void {
   /*  this.user$.subscribe((user)=>{
      if(user.isLogin){
        this.router.navigate(['dashboard']);
      }else{
        this.router.navigate([''])
      }
    }) */
  }

  onLogin(){
    let email: string = 'email'
    let employeeCode: string = 'password'
  }
  /* submit login  */
  onSubmit(){
    console.log(this.formLogin.value.email);
    this.http.post <ReponseLogin>('http://localhost:8080/login',{
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    })
    .subscribe(
      res =>{
        this.store.dispatch(Login(res))
        this.router.navigate(['dashboard']);
      },
      err=>{
        console.log(err);
      }
    )
  }


  onReset(){
    this.employee= initialStateEmployee
    this.datasalida= initialStateGetAsistencia
    this.statusSalida =false
    this.statusMarcar =false
    this.statusError =false
    this.statusEmployee =false
  }

  /* submit asistencia */

  onConfirmAsistencia(){
    console.log("confirmar asistencia");
    this.http.post(`http://localhost:8080/registration/${this.employee.code}`,{})
    .subscribe(
      res => {
        this.onReset()
      },
      err => {
        this.statusMarcar = true;
      }
    )
  }

  onConfirmSalida() {
    this.http.put(`http://localhost:8080/registration/${this.datasalida.id}`,{})
      .subscribe(
        res => {
          this.onReset()
        },
        err => {

        }
      )
  }

  onGetAsistencia(){
    this.http.get <GetAsistencia>(`http://localhost:8080/registration/${this.employee.code}`)
    .subscribe(
      res => {
        this.datasalida =  res
        this.statusSalida =  true
      },
      err => {
        this.statusMarcar = true;
      }
    )
  }

  onExisteAsistenciaNow(){
    this.http.get(`http://localhost:8080/registrationexist/${this.employee.code}`)
    .subscribe(
      res => {

        this.statusError = true;
        this.error = "Ud ya Marco asistencia hoy"
      },
      err => {
        console.log(err);
        this.onGetAsistencia()
      }
    )
  }


  onAsistecia(){
    let code = this.formAsistencia.value.code
    this.http.get <Employeedisplay>(`http://localhost:8080/employee/${code}`)
    .subscribe(
      res => {
        this.employee = res
        this.statusEmployee = true
        this.onExisteAsistenciaNow()
        this.formAsistencia.setValue({ code: '' })
      },
      err => {
        console.log(err);
        this.statusError = true;
        this.error = "No existe el Empleado"
        this.formAsistencia.setValue({ code: '' })
      }
    )
  }


}
