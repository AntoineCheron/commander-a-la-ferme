import React, { FunctionComponent } from 'react'
import { Redirect, Route, Switch, RouteProps } from 'react-router-dom'

import Inventory from './pages/Inventory'
import Order from './pages/Order'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Logout from './pages/Logout'
import PublicForm from './pages/PublicForm'

import AuthService from './services/AuthService'

const AppRouter = () => {
  return <>
    <Switch>
      <Route path="/app/login" exact component={Login} />
      <Route path={["", "/"]} exact><Redirect to="/app/commandes" /></Route>
      <PrivateRoute path="/app" exact><Redirect to="/app/commandes" /></PrivateRoute>
      <PrivateRoute path="/app/commandes"><Orders /></PrivateRoute>
      <PrivateRoute path="/app/commande/:orderId" exact><Order /></PrivateRoute>
      <PrivateRoute path="/app/stock" exact><Inventory /></PrivateRoute>
      <PrivateRoute path="/app/logout" exact><Logout /></PrivateRoute>
      <PrivateRoute path="/app/*"><Redirect to="/app/commandes" /></PrivateRoute>
      <Route path="/:farmName" exact component={PublicForm} />
    </Switch>
  </>
}

const PrivateRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) =>
  <Route {...rest} render={({ location }) =>
    AuthService.isAuthenticated()
      ? children
      : <Redirect
        to={{
          pathname: "/app/login",
          state: { from: location }
        }}
      />
  }
  />

export default AppRouter