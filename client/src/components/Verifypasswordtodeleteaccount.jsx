// import React from "react";
// import { Button, TextInput } from "flowbite-react";
// import { useState } from "react";
// import {
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
// } from "../redux/user/userSlice";
// import { useSelector } from "react-redux";

// function Verifypasswordtodeleteaccount() {
//   const { currentUser, error, loading } = useSelector((state) => state.user);
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [Loading, setLoading] = useState(false);
//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDeleteUser = async () => {
//     try {
//       dispatch(deleteUserStart());
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message));
//       } else {
//         dispatch(deleteUserSuccess(data));
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message));
//     }
//   };
//   const handleVerifyPassword = async (e) => {
//     loading(true);
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         `/api/user/verifypassword/${currentUser._id}`,
//         { password }, // The request body
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         handleDeleteUser();
//       }
//     } catch (error) {
//       // Handle the error (e.g., incorrect password or user not found)
//       console.log(error.response?.data || "An error occurred");
//       setErrorMessage("Incorrect Password");
//       //alert("Incorrect password or user not found!");
//     } finally {
//       loading(false);
//     }
//   };
//   return (
//     <div className="max-w-lg mx-auto p-3 w-full">
//       <h1 className="my-7 text-center font-semibold text-3xl">
//         Enter Your Password
//       </h1>

//       <TextInput
//         type="password"
//         id="password"
//         placeholder="Enter Current Password"
//         value={password}
//         onChange={handlePasswordChange}
//       />
//       <Button
//         type="submit"
//         gradientDuoTone="purpleToBlue"
//         outline
//         // disabled={loading || imageFileUploading}
//         onClick={handleVerifyPassword}
//         style={{
//           marginTop: "1.5rem",
//           width: "100%",
//         }}
//       >
//         {Loading ? "Loading..." : "Verify Password"}
//       </Button>

//       {errorMessage && (
//         <Alert className="mt-5" color="failure">
//           {errorMessage}
//         </Alert>
//       )}
//     </div>
//   );
// }

// export default Verifypasswordtodeleteaccount;

import React, { useState } from "react";
import { Button, TextInput, Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import axios from "axios";

function Verifypasswordtodeleteaccount() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/user/verifypassword/${currentUser._id}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        handleDeleteUser();
      }
    } catch (error) {
      console.log(error.response?.data || "An error occurred");
      setErrorMessage("Incorrect Password");

      // Set a timeout to clear the error message after 2 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">
        Enter Your Password
      </h1>
      <form onSubmit={handleVerifyPassword}>
        <TextInput
          type={!showpassword ? "password" : "text"}
          id="password"
          placeholder="Enter Current Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <h1>show</h1>
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            checked={showpassword}
            onChange={() => {
              return setshowpassword(!showpassword);
            }}
          />
        </div>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleVerifyPassword}
          style={{
            marginTop: "1.5rem",
            width: "100%",
          }}
        >
          {loading ? "Loading..." : "Verify Password"}
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

export default Verifypasswordtodeleteaccount;
