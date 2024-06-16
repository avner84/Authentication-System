import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,  
} from 'react-router-dom';
import RootLayout from '../components/UI/layouts/RootLayout';
import Home from '../pages/main/Home';
import Login from '../pages/auth/Login';
import SignUp from '../pages/auth/Signup';
import Error from '../pages/error/Error';
import UserProfile from '../pages/user/UserProfile';
import EditProfile from '../pages/user/EditProfile';
import ChangePassword from '../pages/user/ChangePassword';
import DeleteAcount from '../pages/user/DeleteAcount';
import AuthSuccessMessages from '../pages/alerts/auth/SuccessAlert';
import AuthErrorAlert from '../pages/alerts/auth/ErrorAlert';
import ActivateAccount from '../pages/auth/ActivateAccount';
import VerifyAccount from '../pages/auth/VerifyAccount';
import ResetPassword from '../pages/auth/ResetPassword';
import UserSuccessMessages from '../pages/alerts/user/SuccessAlert';
import ProtectedRoute from '../components/routes/ProtectedRoute';
import PublicRoute from '../components/routes/PublicRoute';

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/auth">
        <Route path="login" element={<PublicRoute element={Login} />} />
        <Route path="signup" element={<PublicRoute element={SignUp} />} />
        <Route path="activate-account" element={<PublicRoute element={ActivateAccount} />} />
        <Route path="verify-account" element={<PublicRoute element={VerifyAccount} />} />
        <Route path="reset-password" element={<PublicRoute element={ResetPassword} />} />
        <Route path="success" element={<AuthSuccessMessages />} />
        <Route path="error" element={<AuthErrorAlert />} />
      </Route>
      <Route path="/user">
        <Route index element={<ProtectedRoute element={UserProfile} />} />
        <Route path="edit-profile" element={<ProtectedRoute element={EditProfile} />} />
        <Route path="change-password" element={<ProtectedRoute element={ChangePassword} />} />
        <Route path="delete-account" element={<ProtectedRoute element={DeleteAcount} />} />
        <Route path="success" element={<ProtectedRoute element={UserSuccessMessages} />} />       
      </Route>
      <Route path="*" element={<Error />} />
    </Route>
  )
);

export default AppRouter;
