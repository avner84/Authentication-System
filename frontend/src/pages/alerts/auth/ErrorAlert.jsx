import React from "react";
import { Alert, Container } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

const ErrorAlert = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const getMessage = (type) => {
    switch (type) {
      case "verification_link_expired":
        return {
          heading: "Verification Link Expired",
          message: (
            <>
              <div>
                Your verification link has expired. Please request a new
                verification email to continue.
              </div>
              <div className="mt-4">
                <Link to="/auth/activate-account" className="btn btn-primary">
                  Request New Verification Email
                </Link>
              </div>
            </>
          ),
        };
      case "user_not_found":
        return {
          heading: "User Not Found",
          message:
            "No user was found with the provided information. Please check your information and try again or contact support.",
        };
      case "already_verified":
        return {
          heading: "Account Already Verified",
          message: (
            <>
              <div>
                Your account has already been verified. You can now log in to
                your account.
              </div>
              <div className="mt-4">
                <Link to="/auth/login" className="btn btn-primary">
                  Log in
                </Link>
              </div>
            </>
          ),
        };
      case "password_reset_link_expired":
        return {
          heading: "Password Reset Link Expired",
          message: (
            <>
              <div>
                Your password reset link has expired. Please request a new link
                to reset your password.
              </div>
              <div className="mt-4">
                <Link to="/auth/verify-account" className="btn btn-primary">
                  Request New Password Reset Link
                </Link>
              </div>
            </>
          ),
        };
        case "refresh_token_failed":
        return {
          heading: "Session Expired",
          message: (
            <>
              <div>
                Your session has expired or your refresh token is invalid. Please log in again to continue.
              </div>
              <div className="mt-4">
                <Link to="/auth/login" className="btn btn-primary">
                  Log in
                </Link>
              </div>
            </>
          ),
        };
      case "error":
      default:
        return {
          heading: "Error",
          message:
            "An error occurred during the operation. Please try again or contact our support team if the problem persists.",
        };
    }
  };

  const errorInfo = getMessage(type);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Alert variant="secondary" style={{ maxWidth: "600px" }}>
        <Alert.Heading>{errorInfo.heading}</Alert.Heading>
        <div>{errorInfo.message}</div>
      </Alert>
    </Container>
  );
};

export default ErrorAlert;
