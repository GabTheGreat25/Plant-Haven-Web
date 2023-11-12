import React from "react";
import { Navbar, Footer } from "@components";
import { Outlet } from "react-router-dom";
import { block } from "million/react";

const EmployeenLayout = () => {
  return (
    <main>
      <span className="z-[1000] top-0 bg-light-default text-dark-default dark:bg-dark-default dark:text-light-default">
        <Navbar />
      </span>
      <div>
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

const EmployeenLayoutBlock = block(EmployeenLayout);

export default EmployeenLayoutBlock;