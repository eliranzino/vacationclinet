import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { VacationList } from './components/VacationList/VacationList';
import { Register } from './components/Register/Register';
import { Login } from './components/Login/Login';
import { Header } from './components/Header/Header';
import { Display } from './components/Display/Display';
import { Chart } from './components/Chart/Chart';
import { CreateVacation } from './components/CreateVacation/CreateVacation';

export class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Display />
        <Switch>
          <Route path="/vacations">
            <VacationList />
          </Route>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/charts" component={Chart}>
          </Route>
          <Route exact path="/createVacation" component={CreateVacation}>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
