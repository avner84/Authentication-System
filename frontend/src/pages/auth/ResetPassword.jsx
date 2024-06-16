import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import styles from "./ResetPassword.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const { resetPassword, error, isLoading } = useResetPassword();

  return (
    <div className={styles.AuthFormContainer}>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          resetPassword(values.email, values.password, values.confirmPassword)
            .then(() => {
              actions.setSubmitting(false);
            })
            .catch(error => {
              actions.setSubmitting(false);
            });
        }}
      >
        {() => (
          <Form className={`${styles.AuthForm} pb-4`}>
            <div className={styles.AuthFormContent}>
              <h3 className={styles.AuthFormTitle}>Reset Your Password</h3>
              <p className={styles.Instructions}>
                Please enter your details to reset your password.
              </p>
              <div className="form-group mt-3">
                <label>Email address</label>
                <Field type="email" name="email" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="email" />
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <Field type="password" name="password" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="password" />
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Confirm Password</label>
                <Field type="password" name="confirmPassword" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="confirmPassword" />
                </small>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button disabled={isLoading} type="submit" className="btn btn-primary">
                  {!isLoading ? "Reset Password" : <SubmitSpinner />}
                </button>
              </div>
              {error && <div className="alert alert-danger mt-4 mb-1 py-2" role="alert">
                {error}
              </div>}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
