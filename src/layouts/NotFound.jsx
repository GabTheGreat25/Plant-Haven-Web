import React from "react";

export default function () {
  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="grid justify-center items-center h-screen">
        <button
          onClick={goBack}
        >
          Go Back Works!
        </button>
      </div>
    </>
  );
}
