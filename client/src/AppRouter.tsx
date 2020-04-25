import React, { FunctionComponent } from 'react'
import { Redirect, Route, Switch, RouteProps } from 'react-router-dom'

import Inventory from './components/inventory/InventoryPage'
import Order from './components/orders/OrderPage'
import Orders from './components/orders/OrdersPage'
import Login from './components/authentication/Login'
import Logout from './components/authentication/Logout'
import PublicForm from './components/orders/PublicOrderingFormPage'

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