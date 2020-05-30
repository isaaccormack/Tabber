import React from 'react';
import Container from "react-bootstrap/Container";
import {Provider} from "react-redux";
import {Route, Switch} from "react-router";

import './App.css';
import rootStore from "./store";
import Navigation from "./components/common/navigation/component/Navigation";
import OAuth2Page from "./components/oauth/component/OAuth2Page";
import CreatePage from "./components/create/component/CreatePage";

function App() {
  return (
      <Provider store={rootStore}>
        <Container fluid className="app">
          <Navigation />
          <Switch>
            <Route exact path="/" component={CreatePage} />
            <Route exact path="/create" compoent={CreatePage} />
            <Route exact path="/oauth" component={OAuth2Page} />
          </Switch>
        </Container>
      </Provider>
  );
}

export default App;
