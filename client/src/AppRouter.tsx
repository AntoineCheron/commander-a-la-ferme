import React from 'react'
import { Route } from 'react-router-dom'

import Inventory from './pages/Inventory'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Logout from './pages/Logout'

const AppRouter = () => {
  return <>
    <Route path="/" exact component={Orders} />
    <Route path="/commandes" exact component={Orders} />
    <Route path="/stock" exact component={Inventory} />
    <Route path="/login" exact component={Login} />
    <Route path="/logout" exact component={Logout} />
  </>
}
export default AppRouter