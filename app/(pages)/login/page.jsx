"use client";
import React, { useState } from "react";
import { instaLogo } from "@/app/images/Image";
import Image from "next/image";
import { FaFacebookSquare } from "react-icons/fa";

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    userName: "",
    password: "",
  });

  console.log("🚀 ~ Login ~ loginDetails:", loginDetails);
  //   save logindetails in the state
  const savedLoginDetailHandler = (e) => {
    const { name, value } = e?.target;
    setLoginDetails({
      ...loginDetails,
      [name]: value,
    });
  };
  return (
    <div className="bg-white flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-10 px-12">
        <Image src={instaLogo} className="w-[250px] py-10" alt="logo" />
        <input
          type="text" 
          placeholder="username or email"
          name="userName"
          value={loginDetails?.usernameOrEmail}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedLoginDetailHandler}
        />
        <input
          type="password"
          placeholder="password"
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          name="password"
          value={loginDetails?.password}
          onChange={savedLoginDetailHandler}
        />
        <button className="bg-[#4cb5f9] w-full rounded-lg p-2 text-white text-[16px]">
          Login
        </button>
        <div className="w-full flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#dbdbdb]"></div>
          <p className="text-[#737373] px-5">OR</p>
          <div className="w-full h-[1px] bg-[#dbdbdb]"></div>
        </div>
        <div className="flex items-center justify-center gap-4 cursor-pointer">
          <FaFacebookSquare className="text-[#385185] text-[30px]" />
          <p className="text-[#385185] text-[18px]">Login With Facebook</p>
        </div>
        <p className="text-[#00376b] cursor-pointer">Forget password?</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-8 px-[105px] mt-5">
        <p>
          Don't have a account?{" "}
          <span className="text-[#0095f6] cursor-pointer">Sign up.</span>
        </p>
      </div>
    </div>
  );
}
