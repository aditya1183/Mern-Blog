import React from "react";
import { Button, TextInput, Alert } from "flowbite-react";
import { Link } from "react-router-dom";

function Error() {
  return (
    <div
      className="max-w-lg mx-auto p-3 w-full"
      style={{
        height: "60vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "20px",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1> 404 Not Found Please go to the Home Page</h1>
        <Link to="/">
          <Button
            style={{
              padding: ".8rem 1.5rem",
              fontSize: "4rem",
            }}
          >
            Return Home Page{" "}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Error;
