import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Create from './components/Create'
import Requests from './components/Requests'
import Students from './components/Students'
import Calendar from './components/Calendar'
import Bug from './components/Bug'
import Main from './components/Main'
import ScrollToTop from './components/ScrollTop'

export default props => (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/requests' component={ Requests } />
          <Route exact path='/students' component={ Students } />
          <Route exact path='/calendar' component={ Calendar } />
          <Route exact path='/create' component={ Create } />
          <Route exact path='/bugreport' component={ Bug } />
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )