import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Importing layouts
import BlankLayout from './layouts/BlankLayout';
import DefaultLayout from './layouts/DefaultLayout';
import PrivateRoute from './layouts/PrivateRoute';

// Importing views
import LoginView from './views/Authentication/LoginView';
import RegisterView from './views/Authentication/RegisterView';
import DashboardIndex from './views/Dashboard/DashboardIndex';
import UsersIndex from './views/Users/UsersIndex';
import UsersEdit from './views/Users/UsersEdit';
import ShiftsIndex from './views/Shifts/ShiftsIndex';
import ShiftsEdit from './views/Shifts/ShiftsEdit';
import TimelineIndex from './views/TimeLine/TimelineIndex';
import ProductiveIndex from './views/Productive/ProductiveIndex';
import Profile from './layouts/Profile';

// Adjust the import path according to your directory structure
import { FilterProvider } from './views/TimeLine/FilterContext';
import { SessionProvider } from "./context/sessionprovider"; // ✅ Correct

import { SessionContext } from './context/sessionprovider';

// ✅ Layout Wrapper Function
function LayoutWrapper({ layout: Layout, component: Component }) {
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

// ✅ Prevent Authenticated Users from Accessing Login
const LoginRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <SessionProvider> {/* ✅ Wrap the entire application inside SessionProvider */}
        <FilterProvider>
          <Routes>
            {/* ✅ Login Route */}
            <Route
              path="/"
              element={
                <LoginRoute>
                  <LayoutWrapper layout={BlankLayout} component={LoginView} />
                </LoginRoute>
              }
            />
<Route path="/login" element={<LoginView />} />

            <Route
              path="/register"
              element={
                <LoginRoute>
                  <LayoutWrapper layout={BlankLayout} component={RegisterView} />
                </LoginRoute>
              }
            />
            {/* ✅ Protected Routes (Require Authentication) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={DashboardIndex} />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={UsersIndex} />
                </PrivateRoute>
              }
            />
            <Route
              path="/users-edit/:EMPID"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={UsersEdit} />
                </PrivateRoute>
              }
            />
            <Route
              path="/shifts"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={ShiftsIndex} />
                </PrivateRoute>
              }
            />
            <Route
              path="/shifts-edit/:EMPID"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={ShiftsEdit} />
                </PrivateRoute>
              }
            />
            <Route
              path="/timeline"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={TimelineIndex} />
                </PrivateRoute>
              }
            />
            <Route
              path="/productive"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={ProductiveIndex} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <LayoutWrapper layout={DefaultLayout} component={Profile} />
                </PrivateRoute>
              }
            />
          </Routes>
        </FilterProvider>
      </SessionProvider> {/* ✅ Close SessionProvider correctly */}
    </Router>
  );
}

export default App;
