import React from 'react';
import Container from "react-bootstrap/Container";
import {Provider} from "react-redux";
import {Redirect, Route, Switch} from "react-router";


import './App.css';
import rootStore from "./store";
import Navigation from "./components/common/navigation/component/Navigation";
import OAuth2Page from "./components/oauth/component/OAuth2Page";
import CreatePage from "./components/create/component/CreatePage";
import TrimPage from "./components/create/component/TrimPage";
import LoginPage from "./components/login/component/LoginPage";
import UploadPage from "./components/create/component/UploadPage";
import NotFoundPage from "./components/notfound/component/NotFoundPage";
import AccountPage from "./components/account/component/AccountPage";
import LibraryPage from "./components/library/component/LibraryPage";
import SharedPage from "./components/shared/component/SharedPage";
import EditPage from "./components/edit/component/EditPage";
import ViewPage from "./components/view/component/ViewPage";
import RecordPage from './components/create/component/RecordPage';
function App() {
    return (
      <Provider store={rootStore}>
        <div className="app-wrapper">
            <div className="sidenav">
                <Navigation />
            </div>
            <div className="main">
                <Container fluid className="app">
                    <Switch>
                        <Route exact path="/create/upload" component={UploadPage} />
                        <Route exact path="/create/description" component={CreateDescriptionPage} />
                        <Route exact path="/create/record" component={RecordPage} />
                        <Route exact path="/create/trim" component={TrimPage} />
                        <Route exact path="/create" component={CreatePage} />
                        <Route exact path="/account" component={AccountPage} />
                        <Route exact path="/library" component={LibraryPage} />
                        <Route exact path="/edit/:id" component={EditPage} />
                        <Route exact path="/view/:id" component={ViewPage} />
                        <Route exact path="/shared" component={SharedPage} />
                        <Route exact path="/oauth" component={OAuth2Page} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/">
                            <Redirect to="/create" />
                        </Route>
                        <Route exact path="/404" component={NotFoundPage} />
                        <Route path="*">
                            <Redirect to="/404" />
                        </Route>
                    </Switch>
                </Container>
            </div>
        </div>
      </Provider>
    );
}


export default App;
