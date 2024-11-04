import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextInput, Alert } from "flowbite-react";

function ResetPassword() {
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassqword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");

  const { id, token } = useParams();

  const validuser = async () => {
    const res = await fetch(`/api/auth/resetpassword/${id}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.status == 201) {
      console.log("valid user");
    } else {
      return navigate("*");
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    setError("");

    try {
      if (password !== confirmPassword) {
        setpassword("");
        setConfirmPassword("");

        setError("password must match");
        return;
      } else {
        if (password === confirmPassword) {
          const res = await axios.post(
            `/api/auth/${id}/${token}`,
            { password },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data.status == 201) {
            setpassword("");
            setConfirmPassword("");
            // toast.info("Password Reset Sucessfully ...");
            return navigate("/sign-in");
          } else {
            // toast.error("!token expired Generate new Link ..");
          }
        }
      }
    } catch (error) {
      toast.error(error.res.data.message);
      setError(error?.res?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validuser();
  }, [token]);
  return (
    <div
      className="max-w-lg mx-auto p-3 w-full"
      style={{
        height: "60vh",
      }}
    >
      <h1 className="my-7 text-center font-semibold text-3xl">
        Enter Your New Password
      </h1>
      <form onSubmit={handlesubmit}>
        <TextInput
          type={!showpassword ? "password" : "text"}
          id="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <br />
        <TextInput
          type={!showpassword ? "password" : "text"}
          id="password"
          placeholder="Enter Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <input
          style={{
            marginTop: "1.2rem",
            marginLeft:".2rem"
          }}
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          onClick={() => {
            setshowpassqword(!showpassword);
          }}
          checked={showpassword}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          style={{
            marginTop: "1.5rem",
            width: "100%",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </form>

      {Error && (
        <Alert className="mt-5" color="failure">
          {Error}
        </Alert>
      )}
    </div>
  );
}

export default ResetPassword;
