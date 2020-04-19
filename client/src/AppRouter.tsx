import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Logout from './pages/Logout'

const AppRouter = () => {
  return <>
    <Switch>
      <Route path="/" exact component={Orders} />
      <Route path="/commandes" component={Orders} />
      <Route path="/stock" exact component={Inventory} />
      <Route path="/login" exact component={Login} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/*" render={() => <Redirect to="/" />} />
    </Switch>
  </>
}
export default AppRouter