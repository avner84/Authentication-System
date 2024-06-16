import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useChangePassword } from "../../hooks/user/useChangePassword";
import styles from "./ChangePassword.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], "Passwords must match")
    .required("Confirm new password is required"),
});

const ChangePassword = () => {
  const { changePassword, error, isLoading } = useChangePassword();

  return (
    <div className={styles.AuthFormContainer}>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          changePassword(values.currentPassword, values.newPassword, values.confirmNewPassword)
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
              <h3 className={styles.AuthFormTitle}>Change Your Password</h3>
              <p className={styles.Instructions}>
                Please enter your details to change your password.
              </p>
              <div className="form-group mt-3">
                <label>Current Password</label>
                <Field type="password" name="currentPassword" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="currentPassword" />
                </small>
              </div>
              <div className="form-group mt-3">
                <label>New Password</label>
                <Field type="password" name="newPassword" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="newPassword" />
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Confirm New Password</label>
                <Field type="password" name="confirmNewPassword" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="confirmNewPassword" />
                </small>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button disabled={isLoading} type="submit" className="btn btn-primary">
                  {!isLoading ? "Change Password" : <SubmitSpinner />}
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

export default ChangePassword;
