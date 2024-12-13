import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useAppState } from "../App"; 

const Header: React.FC = () => {
  const { login } = useAppState(); 

  return (
    <div className="header sticky top-0 text-3xl z-10 text-red-500 font-bold p-3 border-b-2 border-gray-500 flex justify-between items-center">
      <NavLink to={"/"}>
        <span>
          {" "}
          Filmy<span className="text-white">Duniya</span>{" "}
        </span>
      </NavLink>

      {login ? (
        <NavLink to={"/addmovie"}>
          <h1 className="text-lg text-white cursor-pointer">
            <Button>
              {" "}
              <AddIcon className="mr-1 text-purple-400" />{" "}
              <span className="text-white"> Add New </span>{" "}
            </Button>
          </h1>
        </NavLink>
      ) : (
        <NavLink to={"/login"}>
          <h1 className="text-lg text-white cursor-pointer bg-green-600">
            <Button>
              {" "}
              <span className="text-white "> Login </span>{" "}
            </Button>
          </h1>
        </NavLink>
      )}
    </div>
  );
};

export default Header;
