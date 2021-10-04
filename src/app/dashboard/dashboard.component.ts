import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { logOut } from '../store/user/user.actions';
import { FormBuilder, Validators } from '@angular/forms';


interface Employee{
  code: string
  name: string
  last_name_f: string
  last_name_m: string
  payroll: string
  modality: string
}

interface Report{
  id: string
  entry_date: string
  entry_time: string
  departure_time: string
  name: string
  last_name_f: string
  last_name_m: string
  name_payroll: string
  name_modality: string
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /* disabled inputed */
  disable:boolean= true
  employees:Employee[] = []

  reportdata:Report[] =[]

  employeeSelect: Employee ;

  formEmployee = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    last_name_f: ['', Validators.required],
    last_name_m: ['', Validators.required],
    payroll: ['', Validators.required],
    modality: ['', Validators.required],
  })

  formEditEmployee = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    last_name_f: ['', Validators.required],
    last_name_m: ['', Validators.required],
    payroll: ['', Validators.required],
    modality: ['', Validators.required],
  })

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.onDataEmployee()
    this.onDataReport()
  }

  onLogout() {
    this.store.dispatch(logOut());
  }

  onClearForm(){
    this.formEmployee.setValue({
      code: '',
      name: '',
      last_name_f: '',
      last_name_m: '',
      payroll: '',
      modality: '',
    })
  }

  onSubmit(){
    console.log(this.formEmployee.value);
    let body = this.formEmployee.value

    this.http.post("http://localhost:8080/employee",body)
    .subscribe(
      res => {
        this.onDataEmployee()
        this.onClearForm()
      },
      error => {
        console.log(error);

      }
    )
  }

  onDataEmployee(){
    this.http.get<Employee[]>("http://localhost:8080/employee")
    .subscribe(
      res=>{
        this.employees = res
        console.log(res);
      },
      error=>{

      }
    )
  }

  onClearFormEdit() {
    this.formEditEmployee.setValue({
      code: '',
      name: '',
      last_name_f: '',
      last_name_m: '',
      payroll: '',
      modality: '',
    })
  }

  onEdit(){
    this.http.put(`http://localhost:8080/employee`, this.formEditEmployee.value)
    .subscribe(
      res => {
        this.onDataEmployee()
        this.onClearFormEdit()

      },
      error => {

      }
    )
  }

  onSelectModality(modality:string){
    switch (modality) {
      case 'Remoto':
        return '9de338c1-f596-4699-a1b6-7f36db7dd561'
      case 'Mixto':
        return '742dae06-40d8-447a-9d15-594de6b251fb'
      case 'Presencial':
        return '0fc1d51a-2b79-4ca2-8d2d-ea7463a94911'
      default:
        return 'asdg'
    }
  }

  onSelectPayroll(payroll: string){
    switch (payroll) {
      case 'Practicante':
        return '95443ebc-8b1b-444b-a5c5-4d33e2d91df2'
      case 'CAS':
        return '25f9d4fe-6266-4368-ab93-a2e3d3c6e79e'
      case 'CAP':
        return 'c4595404-83cd-4ddb-b007-7f73295bc9cd'
      default:
        return 'asdg'
    }
  }


  onSelectData(employee:Employee){
    let {payroll, modality, ...rest} = employee;

    let modality_update = this.onSelectModality(modality)
    let payroll_update =  this.onSelectPayroll(payroll)

    console.log(modality_update);
    console.log(payroll_update);


    this.employeeSelect = employee;

    this.formEditEmployee.setValue({
      ...rest,
      modality: modality_update,
      payroll: payroll_update
    })

  }

  onDataReport(){
    this.http.get<Report[]>("http://localhost:8080/report")
      .subscribe(
        res => {
          this.reportdata = res
          console.log(res);

        },
        error => {
        }
      )
  }



}
