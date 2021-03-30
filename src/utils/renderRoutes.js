import React from 'react';
import { Switch, Route as DefaultRoute, Redirect } from 'react-router-dom';

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => {
  if (!routes) {
    return null;
  }

  return (
    <Switch {...switchProps}>
      {routes.map((route, index) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.key || index}
              from={route.path}
              to={route.redirect}
              exact={route.exact}
              strict={route.strict}
            />
          );
        }

        const Route = route.Route || DefaultRoute;
        const routeProps = {
          key: route.key || index,
          exact: route.exact,
          strict: route.strict,
        };
        if (route.path !== '/404') {
          routeProps.path = route.path;
        }
        return (
          <Route
            {...routeProps}
            render={props => {
              const childRoutes = renderRoutes(
                route.routes,
                {},
                { location: props.location },
              );
              if (route.component) {
                return (
                  <route.component {...props} {...extraProps} route={route}>
                    {childRoutes}
                  </route.component>
                );
              } else {
                return childRoutes;
              }
            }}
          />
        );
      })}
    </Switch>
  );
};

export default renderRoutes;
