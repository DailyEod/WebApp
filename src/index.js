import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';


// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
const routes = [
    {
        path: "/",
        exact: true,
        sidebar: () => <div>home!</div>,
        main: () => <App />
    },
    {
        path: "/login",
        sidebar: () => <div>bubblegum!</div>,
        main: () => <App />
    },
    {
        path: "/shoelaces",
        sidebar: () => <div>shoelaces!</div>,
        main: () => <h2>Shoelaces</h2>
    }
];

const SidebarExample = () => (
    <Router>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "10px" }} >
          {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
                />
          ))}
        </div>
     </div>
   </Router>
);

/* <Router>
 * <App />
 * </Router> */

ReactDOM.render(SidebarExample(), document.getElementById('root'));
registerServiceWorker();
