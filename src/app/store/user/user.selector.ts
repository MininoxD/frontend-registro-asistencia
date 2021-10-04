import { createSelector } from '@ngrx/store';
import {AppState} from '../../app.state'
import{User} from './user.model'

export const userSelector = createSelector(
  (state: AppState) => state.user,
  (user:User)=> user,
)