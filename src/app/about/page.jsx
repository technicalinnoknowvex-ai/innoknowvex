import React from "react";

const page = () => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        backgroundColor: "red",
        // padding: "10px",
      }}
    >
      <section
        style={{ width: "100%", height: "100vh", backgroundColor: "salmon" }}
      ></section>
      <section
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "skyblue",
        }}
      ></section>
      <section
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "lightgreen",
        }}
      ></section>
    </div>
  );
};

export default page;
