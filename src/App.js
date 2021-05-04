import React, { Suspense, useEffect } from "react";
import NavigationMenu from "./Components/NavigationMenu";
import "./Styles/css/main.css";
import { menuItem } from "./Routes/MenuItem";
import { Route, Switch } from "react-router-dom";
import { Routes } from "./Routes/Routes";
import { useState } from "react";

console.log("env variables", process.env);

function App() {
  const [user, setUser] = useState(null);

  return (
    <div id="App">
      <NavigationMenu menu={menuItem} />
      <div id="page-wrap">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Switch>
            {Routes.map((item) => (
              <Route exact path={item.pathname}>
                <item.component setUser={setUser} user={user}></item.component>
              </Route>
            ))}
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
