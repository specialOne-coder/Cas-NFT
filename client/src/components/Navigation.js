import React from "react";
import {
  Routes,
  Route,
  HashRouter as Router,
} from "react-router-dom";
import { AirdropPage, BurnPage, HomePage, MintPage,MyPage } from "../pages/index";
import {Navbar} from "./index";


const Navigation = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/mint" element={<MintPage />} />
        <Route exact path="/airdrop" element={<AirdropPage />} />
        <Route exact path="/burn" element={<BurnPage/>} />
        <Route exact path="/mynfts" element={<MyPage/>} />
      </Routes>
    </Router>
  );
};


export default Navigation;
