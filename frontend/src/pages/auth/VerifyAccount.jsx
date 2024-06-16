import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useVerifyAccount } from "../../hooks/auth/useVerifyAccount";
import styles from "./VerifyAccount.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const VerifyAccount = () => {
  const { verifyAccount, error, isLoading } = useVerifyAccount();

  return (
    <div className={styles.AuthFormContainer}>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          verifyAccount(values.email)
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
              <h3 className={styles.AuthFormTitle}>Verify Your Account</h3>
              <p className={styles.Instructions}>
                Please enter your email address to receive a verification link.
              </p>
              <div className="form-group mt-3">
                <label>Email address</label>
                <Field type="email" name="email" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="email" />
                </small>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button disabled={isLoading} type="submit" className="btn btn-primary">
                  {!isLoading ? "Send Verification Email" : <SubmitSpinner />}
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

export default VerifyAccount;
