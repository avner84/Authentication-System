import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSignup } from "../../hooks/auth/useSignup"
import styles from "./Signup.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";



const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Signup = () => {
  const {signup, error, isLoading} = useSignup()

  return (
    <div className={styles.AuthFormContainer}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          signup(values.firstName, values.lastName, values.email, values.password, values.confirmPassword)
            .then(() => {
              actions.setSubmitting(false); // Action completed, enable form re-submission
            })
            .catch(error => {
              actions.setSubmitting(false); // An error occurred, allow re-submission
            });        
        }}
      >
        {() => (
          <Form className={`${styles.AuthForm} pb-4`}>
            <div className={styles.AuthFormContent}>
              <h3 className={styles.AuthFormTitle}>Sign Up</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>First Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      className="form-control"
                    />
                    <small className="form-text text-danger">
                      <ErrorMessage name="firstName" />
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <Field
                      type="text"
                      name="lastName"
                      className="form-control"
                    />
                    <small className="form-text text-danger">
                      <ErrorMessage name="lastName" />
                    </small>
                  </div>
                </div>
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <Field type="email" name="email" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="email" />
                </small>
              </div>
              <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
                  <div className="form-group mt-3">
                    <label>Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                    />
                    <small className="form-text text-danger">
                      <ErrorMessage name="confirmPassword" />
                    </small>
                  </div>
                </div>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button disabled={isLoading} type="submit" className="btn btn-primary">
                 {
                 !isLoading? "Submit" : 
                 <SubmitSpinner/>
                 }
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

export default Signup;
