import { createAction, props } from "@ngrx/store";
export const Login = createAction(
  '[User] Login',
  props<{ employeeCode: string}>()
)

export const logOut =  createAction(
  '[user] LogOut'
)