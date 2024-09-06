import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CommonForm from "@/components/common/form";
import { resigterFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/redux/authSlice";

const initialState = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  referralCode: "",
};

const AuthSignup = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    console.log(formData);
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) navigate("/shop/home");
    });
  }

  useEffect(() => {
    // Extract referral token from URL and set referral code
    const queryParams = new URLSearchParams(window.location.search);
    const referralToken = queryParams.get("referralToken");

    // Call API to get the referral code
    if (referralToken) {
      setFormData((prev) => ({ ...prev, referralCode: referralToken }));
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign Up
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={resigterFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthSignup;
