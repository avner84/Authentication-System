import React from "react";
import { Alert, Container } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

const SuccessAlert = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const getMessage = (type) => {
    switch (type) {
      case "password_changed":
        return {
          heading: "Password Changed Successfully!",
          message:
            "Your password has been Changed successfully. You can now log in with your new password.",
          link: null
        };
      case "user_details_updated":
        return {
          heading: "User Details Updated Successfully!",
          message: "Your user details have been updated successfully.",
          link: <Link to="/user" className="btn btn-primary">View user details</Link>,
        };
      case "account_deleted":
        return {
          heading: "User Account Deleted Successfully!",
          message: "Your user account has been deleted successfully. We are sorry to see you go.",
          link: null,
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
