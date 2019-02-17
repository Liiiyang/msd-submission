import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";
import Script from "./script";

export default props => {
  return (
    <Container>
      <Script />
      <Header />
      {props.children}
    </Container>
  );
};
