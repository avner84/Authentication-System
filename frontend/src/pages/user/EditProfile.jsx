import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEditProfile } from "../../hooks/user/useEditProfile";
import styles from "./EditProfile.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  password: Yup.string().required("Password is required for verification"),
});

const EditProfile = () => {
  const { editProfile, error, isLoading } = useEditProfile();
  
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className={styles.AuthFormContainer}>
      <Formik
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          password: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          editProfile(values.firstName, values.lastName, values.password)
            .then(() => {
              actions.setSubmitting(false);
            })
            .catch(error => {
              actions.setSubmitting(false);
            });
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className={`${styles.AuthForm} pb-4`}>
            <div className={styles.AuthFormContent}>
              <h3 className={styles.AuthFormTitle}>Edit Your Profile</h3>
              <p className={styles.Instructions}>
                Please enter your details to edit your profile.
              </p>
              <div className="form-group mt-3">
                <label>First Name</label>
                <Field type="text" name="firstName" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="firstName" />
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Last Name</label>
                <Field type="text" name="lastName" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="lastName" />
                </small>
              </div>
              <div className={`form-group mt-4 mb-4 ${styles.PasswordContainer}`}>
                <label>Password for Verification</label>
                <Field type="password" name="password" className="form-control" />
                <small className="form-text text-danger">
                  <ErrorMessage name="password" />
                </small>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button
                  disabled={isLoading || 
                    (values.firstName === user.firstName && 
                    values.lastName === user.lastName) ||
                    isSubmitting}
                  type="submit" 
                  className="btn btn-primary"
                >
                  {!isLoading ? "Edit Profile" : <SubmitSpinner />}
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

export default EditProfile;
