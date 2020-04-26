import React, { FunctionComponent } from 'react'
import { Redirect, Route, Switch, RouteProps } from 'react-router-dom'

import Inventory from './components/inventory/InventoryPage'
import OnboardingPage from './components/oboarding/OnboardingPage'
import Order from './components/orders/OrderPage'
import Orders from './components/orders/OrdersPage'
import Login from './components/authentication/Login'
import Logout from './components/authentication/Logout'
import MyFarmPage from './components/my_farm/MyFarmPage'
import PublicForm from './components/orders/PublicOrderingFormPage'
import Register from './components/authentication/Register'

import { ContextProvider } from './context/UserContext'
import AuthService from './services/AuthService'
import { isUser, isUserNotOnboarded } from './models'

const AppRouter = () =>
  <Switch>
    <NotAuthenticatedRoute path="/app/login" exact><Login /></NotAuthenticatedRoute>
    <NotAuthenticatedRoute path="/app/inscription" exact><Register /></NotAuthenticatedRoute>
    <Route path={["", "/"]} exact><Redirect to="/app/commandes" /></Route>
    <UserNotOnboardedRoute path="/app/onboarding"><OnboardingPage /></UserNotOnboardedRoute>
    <AuthenticatedRoute path="/app" exact><Redirect to="/app/commandes" /></AuthenticatedRoute>
    <AuthenticatedRoute path="/app/commandes"><Orders /></AuthenticatedRoute>
    <AuthenticatedRoute path="/app/commande/:orderId" exact><Order /></AuthenticatedRoute>
    <AuthenticatedRoute path="/app/stock" exact><Inventory /></AuthenticatedRoute>
    <AuthenticatedRoute path="/app/mon-exploitation" exact><MyFarmPage /></AuthenticatedRoute>
    <UserNotOnboardedRoute path="/app/logout" exact><Logout /></UserNotOnboardedRoute>
    <AuthenticatedRoute path="/app/*"><Redirect to="/app/commandes" /></AuthenticatedRoute>
    <Route path="/:farmName" exact component={PublicForm} />
  </Switch>

const AuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) =>
  <Route {...rest} render={({ location }) => {
    const user = AuthService.getCurrentUser()
    const isAuthenticated = AuthService.isAuthenticated()

    if (isAuthenticated && user && isUser(user)) {
      return <ContextProvider value={user}>{children}</ContextProvider>
    } else if (isAuthenticated && user && isUserNotOnboarded(user)) {
      return <Redirect
        to={{
          pathname: "/app/onboarding",
          state: { from: location }
        }}
      />
    } else {
      return <Redirect
        to={{
          pathname: "/app/login",
          state: { from: location }
        }}
      />
    }
  }}
  />

const UserNotOnboardedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) =>
  <Route {...rest} render={({ location }) => {
    const user = AuthService.getCurrentUser()
    const isAuthenticated = AuthService.isAuthenticated()

    if (isAuthenticated && user && isUserNotOnboarded(user)) {
      return <ContextProvider value={user}>{children}</ContextProvider>
    } else {
      return <Redirect
        to={{
          pathname: "/app/login",
          state: { from: location }
        }}
      />
    }
  }}
  />

const NotAuthenticatedRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) =>
  <Route {...rest} render={() => {
    const isAuthenticated = AuthService.isAuthenticated()

    if (!isAuthenticated) {
      return children
    } else {
      return <Redirect
        to="/app/commandes"
      />
    }
  }} />

export default AppRouter