import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLogin } from "../../hooks/auth/useLogin";
import styles from "./Login.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";
import { NavLink } from "react-router-dom";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { login, error, isLoading } = useLogin();

  return (
    <div className={styles.AuthFormContainer}>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          login(values.email, values.password)
            .then(() => {
              actions.setSubmitting(false); // Action completed, enable form re-submission
            })
            .catch((error) => {
              actions.setSubmitting(false); // An error occurred, allow re-submission
            });
        }}
      >
        {() => (
          <Form className={`${styles.AuthForm} pb-4`}>
            <div className={styles.AuthFormContent}>
              <h3 className={styles.AuthFormTitle}>Sign In</h3>
              <div className="text-center">
                Not registered yet?{" "}
                <NavLink to="/auth/signup" className="me-3">
                  Sign Up
                </NavLink>
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <Field type="email" name="email" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="email" />
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                />
                <small className="form-text text-danger">
                  <ErrorMessage name="password" />
                </small>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {!isLoading ? "Submit" : <SubmitSpinner />}
                </button>
              </div>
              <p className="text-start mt-4">
                Forgot <NavLink to="/verify-account">password?</NavLink>
              </p>
              {error && (
                <div className="alert alert-danger mt-4 mb-1 py-2" role="alert">
                  {error}
                  {error === "User account is not active." && (
                    <p className="mb-1">
                      <NavLink to="/activate-account">Activate Account</NavLink>                      
                    </p>
                  )}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
