import React from "react";
import { useState } from "react";
import { Button, TextInput, Alert } from "flowbite-react";
import axios from "axios";

function ForgootenPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMessage("");
    // setError("");
    setLoading(true);
    console.log(email);

    try {
      const response = await axios.post(
        "/api/auth/forgot-password",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 201) {
        // toast.info(response.data.message);
        setEmail("");
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto p-3 w-full"
      style={{
        height: "60vh",
      }}
    >
      <h1 className="my-7 text-center font-semibold text-3xl">
        Enter Your gmail
      </h1>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="gmail"
          id="password"
          placeholder="Enter Gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          style={{
            marginTop: "1.5rem",
            width: "100%",
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Verify Gmail"}
        </Button>
      </form>

      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default ForgootenPassword;
