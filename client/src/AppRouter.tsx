import React, { FunctionComponent } from 'react'
import { Redirect, Route, Switch, RouteProps } from 'react-router-dom'

import Inventory from './components/inventory/InventoryPage'
import Order from './components/orders/OrderPage'
import Orders from './components/orders/OrdersPage'
import Login from './components/authentication/Login'
import Logout from './components/authentication/Logout'
import MyFarmPage from './components/my_farm/MyFarmPage'
import PublicForm from './components/orders/PublicOrderingFormPage'

import { ContextProvider } from './context/UserContext'
import AuthService from './services/AuthService'

const AppRouter = () => {
  return <>
    <Switch>
      <Route path="/app/login" exact component={Login} />
      <Route path={["", "/"]} exact><Redirect to="/app/commandes" /></Route>
      <AuthenticatedRoute path="/app" exact><Redirect to="/app/commandes" /></AuthenticatedRoute>
      <AuthenticatedRoute path="/app/commandes"><Orders /></AuthenticatedRoute>
      <AuthenticatedRoute path="/app/commande/:orderId" exact><Order /></AuthenticatedRoute>
      <AuthenticatedRoute path="/app/stock" exact><Inventory /></AuthenticatedRoute>
      <AuthenticatedRoute path="/app/mon-exploitation" exact><MyFarmPage /></AuthenticatedRoute>
      <AuthenticatedRoute path="/app/logout" exact><Logout /></AuthenticatedRoute>
      <AuthenticatedRoute path="/app/*"><Redirect to="/app/commandes" /></AuthenticatedRoute>
      <Route path="/:farmName" exact component={PublicForm} />
    </Switch>
  </>
}

const AuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) =>
  <Route {...rest} render={({ location }) => {
    const user = AuthService.getCurrentUser()

    return AuthService.isAuthenticated() && user !== undefined && user !== null
      ? <ContextProvider value={user}>{children}</ContextProvider>
      : <Redirect
        to={{
          pathname: "/app/login",
          state: { from: location }
        }}
      />
  }}
  />

export default AppRouter