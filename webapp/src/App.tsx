import React from 'react';
import Container from "react-bootstrap/Container";
import { Provider } from "react-redux";
import {Redirect, Route, Switch} from "react-router";
import PrivateRoute from "./PrivateRoute";

import './App.css';
import rootStore from "./store";
import Header from "./components/common/header/component/Header";
import OAuth2Page from "./components/oauth/component/OAuth2Page";
import CreatePage from "./components/create/component/CreatePage";
import LoginPage from "./components/login/component/LoginPage";
import UploadPage from "./components/create/component/UploadPage";
import NotFoundPage from "./components/notfound/component/NotFoundPage";
import LibraryPage from "./components/library-pages/components/LibraryPage";
import SharedPage from "./components/library-pages/components/SharedPage";
import CreateDescriptionPage from "./components/create/component/CreateDescriptionPage";
import EditPage from "./components/lick-pages/components/edit/EditPage";
import ViewPage from "./components/lick-pages/components/view/ViewPage";
import RecordPage from './components/create/component/RecordPage';
import LandingPage from "./components/home-pages/components/landing/LandingPage";
import Footer from "./components/common/footer/component/Footer";


function App() {
    return (
      <Provider store={rootStore}>
        <div className="app-wrapper">
            <Header />
            <div className="main">
                <Container fluid className="app">
                    <Switch>
                        <Route exact path="/create/upload" component={UploadPage} />
                        <Route exact path="/create/description" component={CreateDescriptionPage} />
                        <Route exact path="/create/record" component={RecordPage} />
                        <Route exact path="/create" component={CreatePage} />
                        <PrivateRoute exact path="/library" component={LibraryPage} />
                        <Route exact path="/edit/:id" component={EditPage} />
                        <Route exact path="/view/:id" component={ViewPage} />
                        <Route exact path="/shared" component={SharedPage} />
                        <Route exact path="/oauth" component={OAuth2Page} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/" component={LandingPage} />
                        <Route exact path="/404" component={NotFoundPage} />
                        <Route path="*">
                            <Redirect to="/404" />
                        </Route>
                    </Switch>
                </Container>
            </div>
            <Footer />
        </div>
      </Provider>
    );
}


export default App;
