import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import GlobalModalHandler from "./components/modal/GlobalModalHandler";


const App = () => {
  return (
    <div className="bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300 min-h-screen flex flex-col">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 mt-2 mb-9 overflow-y-auto ">
        <GlobalModalHandler />  {/* Yeh modal ko route sunne dega */}
        <AppRoutes />
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom--1 left-0 right-0 z-50">
        <Footer />
      </div>

    </div>
  );
};

export default App;
