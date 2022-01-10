import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BookProfile from "./components/BookProfile/BookProfile";

import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import NotFound from './components/NotFound/NotFound';
import SearchResults from "./components/SearchResults/SearchResults";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import UserProfile from "./components/UserProfile/UserProfile";
import Footer from "./components/Footer/Footer";
import SignIn from "./components/SignIn/SignIn";

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Switch>

          <Route exact path="/">
            <HomePage />
          </Route>

          <Route exact path="/search/:parameters">
            <SearchResults />
          </Route>

          <Route exact path="/book/:identifier/:title">
            <BookProfile />
          </Route>

          <Route exact path="/sign-in">
            <SignIn />
          </Route>

          <Route exact path="/create-account">
            <CreateAccount />
          </Route>

          <Route exact path="/profile/:username">
            <UserProfile />
          </Route>

          <Route exact path="*">
            <NotFound />
          </Route>

        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
