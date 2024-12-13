import React, { useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { query, where, getDocs } from "firebase/firestore";
import swal from "sweetalert";
import { usersRef } from "../firebase/Firebase";
import bcryptjs from "bcryptjs";
import { AppState } from "../App";

// Define the User interface
interface User {
  password: string;
  userName: string;
}

const Login = () => {
  const useAppState = useContext(AppState) || {
    setUserName: (name: string) => {},
    setLogin: (status: boolean) => {},
  };
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const startLogin = async () => {
    setLoading(true);

    const quer = query(usersRef, where("mobile", "==", form.mobile));

    getDocs(quer)
      .then((queryData) => {
        if (queryData.size === 0) {
          throw new Error("Invalid Credentials");
        } else {
          queryData.forEach((doc) => {
            const _data = doc.data() as User; // Explicit type assertion

            const isUserPass = bcryptjs.compareSync(form.password, _data.password);
            if (isUserPass) {
              useAppState.setUserName(_data.userName);
              useAppState.setLogin(true);

              swal({
                title: "Logged In",
                icon: "success",
                buttons: false,
                timer: 3000,
              });

              setLoading(false);
              navigate("/");
            } else {
              throw new Error("Invalid Credentials");
            }
          });
        }
      })
      .catch((error) => {
        swal({
          title: error.message,
          icon: "error",
          buttons: false,
          timer: 3000,
        });
        setLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startLogin();
  };

  return (
    <div className="flex mt-4 justify-center">
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-8 mx-auto">
          <div className="flex flex-col text-center w-full mb-4">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
              Login
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-full">
                  <div className="relative">
                    <label htmlFor="mob" className="leading-7 text-sm text-white">
                      Mobile No.
                    </label>
                    <input
                      type="text"
                      id="mob"
                      name="mob"
                      className="w-full bg-gray-100  rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      value={form.mobile}
                      autoComplete="off"
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                      
                        let numericValue = target.value.replace(/[^0-9]/g, "");
                      
                        if (numericValue.length > 10) {
                          numericValue = numericValue.slice(0, 10);
                        }
                      
                        target.value = numericValue;
                      
                        setForm({ ...form, mobile: numericValue });
                      }}
                      
                      required
                    />
                  </div>
                </div>

                <div className="p-2 w-full">
                  <div className="relative">
                    <label htmlFor="pass" className="leading-7 text-sm text-white">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="pass"
                      name="pass"
                      className="w-full bg-gray-100  rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />

                    <Link to='/signup'>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 cursor-pointer"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                      "Login"
                    )}
                  </button>
                </div>

                <div className="p-2 w-full pt-8 mt-8 border-t border-gray-100 opacity-25 text-center"></div>
              </div>
            </div>
          </form>

          <div className="flex justify-center">
            <p className="text-white">
              Do not have an account?{" "}
              <Link to="/signup">
                <span className="text-blue-500">Sign Up</span>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
