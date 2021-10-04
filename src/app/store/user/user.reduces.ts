import { createReducer, on } from '@ngrx/store'
import { Login, logOut } from './user.actions'
import { User } from './user.model'

export const initialState:User = {
  name: '',
  last_name_f: '',
  last_name_m: '',
  isLogin: true,
  isLoading:false,
  error:'',
  employeeCode:''
}

export const userReducer = createReducer(
  initialState,
  on(Login, (state, {employeeCode})=>{
    const state_new = {
      ...state,
      isLogin: true,
      employeeCode,
    }
    return state_new
  }),
  on(logOut,(state)=>{
    const state_new = {
      ...state,
      isLogin: false,
    }
    return state_new
  })
)
