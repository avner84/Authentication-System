import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDeleteAccount } from "../../hooks/user/useDeleteAcount";
import styles from "./DeleteAcount.module.css";
import SubmitSpinner from "../../components/UI/spinners/SubmitSpinner";

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required for verification"),
});

const DeleteAccount = () => {
  const { deleteAccount, error, isLoading } = useDeleteAccount();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const handleDelete = async () => {
    const response = await deleteAccount(password);
    if (response.error) {
      setFormError(response.error);
      setConfirmDelete(false);
    }
  };

  return (
    <div className={styles.AuthFormContainer}>
      {!confirmDelete ? (
        <Formik
          initialValues={{ password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            setPassword(values.password);
            setConfirmDelete(true);
            setFormError(null);
            actions.setSubmitting(false);
          }}
        >
          {() => (
            <Form className={`${styles.AuthForm} pb-4`}>
              <div className={styles.AuthFormContent}>
                <h3 className={styles.AuthFormTitle}>Delete Your Account</h3>
                <p className={styles.Instructions}>
                  Please enter your password to delete your account.
                </p>
                <div className="form-group mt-3">
                  <label>Password for Verification</label>
                  <Field type="password" name="password" className="form-control" />
                  <small className="form-text text-danger">
                    <ErrorMessage name="password" />
                  </small>
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button disabled={isLoading} type="submit" className="btn btn-danger">
                    {!isLoading ? "Delete Account" : <SubmitSpinner />}
                  </button>
                </div>
                {(error || formError) && <div className="alert alert-danger mt-4 mb-1 py-2" role="alert">
                  {error || formError}
                </div>}
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className={styles.AuthForm}>
          <div className={styles.AuthFormContent}>
            <h3 className={styles.AuthFormTitle}>Are you sure?</h3>
            <p className={styles.Instructions}>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="d-grid gap-2 mt-3">
              <button 
                onClick={handleDelete} 
                className="btn btn-danger">
                Yes, Delete
              </button>
              <button 
                onClick={() => setConfirmDelete(false)} 
                className="btn btn-secondary">
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
