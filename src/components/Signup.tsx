import React, { useState, ChangeEvent, FormEvent } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { usersRef } from "../firebase/Firebase";
import { addDoc, query, where, getDocs } from "firebase/firestore";
import bcryptjs from "bcryptjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import app from "../firebase/Firebase";

const auth = getAuth(app);

interface FormState {
  userName: string;
  mobile: string;
  password: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    userName: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: any) => {},
      },
      auth
    );
  };

  const requestOtp = async () => {
    try {
      setLoading(true);
      const quer = query(usersRef, where("mobile", "==", form.mobile));
      const querySnapshot = await getDocs(quer);

      if (querySnapshot.size > 0) {
        setLoading(false);
        throw new Error("User Already Registered");
      }

      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier);
      window.confirmationResult = confirmationResult;

      swal({
        text: "OTP Sent",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
      setOtpSent(true);
    } catch (error: any) {
      swal({
        text: error.message,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
    }
  };

  const handleSubmit1 = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    requestOtp();
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      await window.confirmationResult.confirm(OTP);
      await uploadData();
      swal({
        text: "Successfully Registered",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
        console.log(error)
      swal({
        text: "Invalid OTP",
        icon: "error",
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
    }
  };

  const uploadData = async () => {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(form.password, salt);
    const capitalizedUserName = form.userName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    await addDoc(usersRef, {
      userName: capitalizedUserName,
      password: hash,
      mobile: form.mobile,
    });
  };

  const handleSubmit2 = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyOTP();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof FormState
  ) => {
    const { value } = e.target;
    setForm({ ...form, [field]: value });
  };

  const handleMobileInput = (e: ChangeEvent<HTMLInputElement>) => {
    let numericValue = e.target.value.replace(/[^0-9]/g, "");
    if (numericValue.length > 10) {
      numericValue = numericValue.slice(0, 10);
    }
    setForm({ ...form, mobile: numericValue });
  };

  return (
    <div className="flex max-md:mt-4 justify-center">
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-8 mx-auto">
          <div className="flex flex-col text-center w-full mb-4">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              Create a new account
            </h1>
          </div>

          {!otpSent ? (
            <>
              <form onSubmit={handleSubmit1}>
                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                  <div className="flex flex-wrap -m-2">
                    <div className="p-2 w-full">
                      <div className="relative">
                        <label
                          htmlFor="userName"
                          className="leading-7 text-sm text-white"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          autoComplete="off"
                          className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          value={form.userName}
                          onChange={(e) => handleInputChange(e, "userName")}
                          required
                        />
                      </div>
                    </div>

                    <div className="p-2 w-full">
                      <div className="relative">
                        <label
                          htmlFor="mob"
                          className="leading-7 text-sm text-white"
                        >
                          Mobile No.
                        </label>
                        <input
                          type="text"
                          id="mob"
                          name="mob"
                          className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          value={form.mobile}
                          autoComplete="off"
                          onInput={handleMobileInput}
                          required
                        />
                      </div>
                    </div>

                    <div className="p-2 w-full">
                      <div className="relative">
                        <label
                          htmlFor="pass"
                          className="leading-7 text-sm text-white"
                        >
                          Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="pass"
                          name="pass"
                          className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          value={form.password}
                          onChange={(e) => handleInputChange(e, "password")}
                          required
                        />

                        <Link to='singnup'>
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-1/2 cursor-pointer"
                          >
                            {showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="p-2 w-full">
                      <button
                        type="submit"
                        className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg transition-all duration-500"
                      >
                        {loading ? (
                          <TailSpin height={30} width={30} color="white" />
                        ) : (
                          "Request OTP"
                        )}
                      </button>
                    </div>

                    <div className="p-2 w-full pt-8 mt-8 border-t border-gray-100 opacity-25 text-center"></div>
                  </div>
                </div>
              </form>

              <p className="text-xs text-gray-500 mt-3 flex justify-center">
                Already have an account ?
                <Link to="/login">
                  <span className="text-xs text-white ml-2">Log In</span>
                </Link>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit2}>
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="mob"
                      className="leading-7 text-sm text-white"
                    >
                      OTP
                    </label>
                    <input
                      type="number"
                      id="mob"
                      name="mob"
                      className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      value={OTP}
                      onChange={(e) => setOTP(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="p-2 w-full">
                  <button
                    type="submit"
                    className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg transition-all duration-500"
                  >
                    {loading ? (
                      <TailSpin height={30} width={30} color="white" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
