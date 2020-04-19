import React from 'react'
import { Redirect, Route, Switch, useParams } from 'react-router-dom'

import Inventory from './pages/Inventory'
import Order from './pages/Order'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Logout from './pages/Logout'
import PublicForm from './pages/PublicForm'

const AppRouter = () => {
  return <>
    <Switch>
      <Route path={["", "/"]} exact render={() => <Redirect to="/app" />} />
      <Route path="/app" exact component={Orders} />
      <Route path="/app/commandes" component={Orders} />
      <Route path="/app/commande/:orderId" exact component={Order} />
      <Route path="/app/stock" exact component={Inventory} />
      <Route path="/app/login" exact component={Login} />
      <Route path="/app/logout" exact component={Logout} />
      <Route path="/app/*" render={() => <Redirect to="/app" />} />
      <Route path="/:farmName" exact component={PublicForm} />
    </Switch>
  </>
}
export default AppRouter