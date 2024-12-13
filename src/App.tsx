import React, { createContext, useState, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Card from "./components/Card";
import AddMovie from "./components/AddMovie";
import Detail from "./components/Deatil";
import Login from "./components/Login";
import Signup from "./components/Signup";

// Define the shape of the context state
interface AppStateType {
  login: boolean;
  userName: string;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}

// Define the context and set it to undefined initially
const AppState = createContext<AppStateType | undefined>(undefined);

const App: React.FC = () => {
  const [login, setLogin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  return (
    <AppState.Provider value={{ login, userName, setLogin, setUserName }}>
      <div className="relative">
        <Header />
        <Routes>
          <Route path="/" element={<Card />} />
          <Route path="/addmovie" element={<AddMovie />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </AppState.Provider>
  );
};

export default App;
export { AppState };

// Custom hook to use the AppState context
export const useAppState = (): AppStateType => {
  const context = useContext(AppState);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
