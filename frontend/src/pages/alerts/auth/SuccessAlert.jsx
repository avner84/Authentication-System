import React from "react";
import { Alert, Container } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

const SuccessAlert = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const getMessage = (type) => {
    switch (type) {
      case "verification_email_sent":
        return {
          heading: "Verification Email Sent!",
          message:
            "A verification email has been sent to your email address. Please check your email to verify your account and complete the registration process.",
          link: null,
        };
      case "email_verified":
        return {
          heading: "Email Verified Successfully!",
          message:
            "Your email has been verified. You can now log in to your account.",
          link: <Link to="/auth/login"className="btn btn-primary">Log in</Link>,          
        };
        case "password_reset_verification_email_sent":
      return {
        heading: "Verify Your Account to Reset Password",
        message:
          "A verification email for password reset has been sent to your email address. The verification link is valid for the next 5 minutes. Please use it promptly to proceed with resetting your password.",
        link: null,
      };
      case "password_reset":
        return {
          heading: "Password Reset Successfully!",
          message:
            "Your password has been reset. You can now log in with your new password.",
          link: <Link to="/auth/login" className="btn btn-primary">Log in</Link>,
        };   
        case "account_deleted":
        return {
          heading: "Account Deleted Successfully!",
          message: "Your account has been deleted. We're sorry to see you go.",
          link: null
        };     
      default:
        return {
          heading: "Success!",
          message: "The operation was completed successfully!",
          link: null,
        };
    }
  };

  const successInfo = getMessage(type);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Alert variant="info" style={{ maxWidth: "600px" }}>
        <Alert.Heading>{successInfo.heading}</Alert.Heading>
        <p>{successInfo.message}</p>
        {successInfo.link && (
          <>
            <hr />
            <p className="mb-0">{successInfo.link}</p>
          </>
        )}
      </Alert>
    </Container>
  );
};

export default SuccessAlert;
