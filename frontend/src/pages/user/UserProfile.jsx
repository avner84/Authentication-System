import React from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { FaUserLarge } from "react-icons/fa6";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { user } = useAuthContext();

  // If the user has not yet loaded, show a loading message or a spinner
  if (!user) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  const username = `${user.firstName} ${user.lastName}`;

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Row>
        <Col>
          <Card className={styles.customCard}>
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div className={styles.profileIconContainer}>
                <FaUserLarge className={styles.userIcon} />
              </div>
              <div className={styles.userInfo}>
                <Card.Title>{username}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
