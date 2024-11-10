import './polyfills';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles';
import { publicRoutes, privateRoutes, protectedRoutes } from './routes';
import PrivateRoute from './components/PrivateRoute';
import DefaultLayout from './components/DefaultLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <GlobalStyles>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map((route) => {
            const Page = route.component;
            return <Route key={route.path} path={route.path} element={<Page />} />;
          })}

          {privateRoutes.map((route) => {
            const Page = route.component;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateRoute>
                    <DefaultLayout>
                      <Page />
                    </DefaultLayout>
                  </PrivateRoute>
                }
              />
            );
          })}

          {protectedRoutes.map((route) => {
            const Page = route.component;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <DefaultLayout>
                      <Page />
                    </DefaultLayout>
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </GlobalStyles>
  );
}

export default App;
