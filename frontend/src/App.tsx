import { Route, Routes } from "react-router-dom";
import ProductsDashboard from "./pages/products/ProductsDashboard";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { checkAuth } from "./store/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import { SignUp } from "./pages/auth/Signup";
import { Login } from "./pages/auth/Login";
import { PublicRoute } from "./components/PublicRoute";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/admin/AdminDashboard";



const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
    return (<Routes>
        <Route path="/" element={

                <Layout>
                    <ProductsDashboard/>
                </Layout>
        }/>
         <Route
            path="/signup"
            element={
              <PublicRoute>
                <Layout>
                  <SignUp />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout>
                  <Login />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
    </Routes>);
}

const App = () => {
    return (
        <Provider store={store}>
      <div className="min-h-screen bg-background text-foreground">
        <AppContent />
        <Toaster
  position="top-center"
  // containerStyle={{
  //   top: 80, // Account for navbar height
  // }}
  />
      </div>
    </Provider>
    );
}

export default App;