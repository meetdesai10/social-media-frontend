"use client";
import React, { useState } from "react";
import { instaLogo } from "@/app/images/Image";
import Image from "next/image";
import { FaFacebookSquare } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/app/config";

export default function Login() {
  const navigate = useRouter();
  const [loader, setLoader] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    userName: "",
    password: "",
  });

  //   save logindetails in the state
  const savedLoginDetailHandler = (e) => {
    const { name, value } = e?.target;
    setLoginDetails({
      ...loginDetails,
      [name]: value,
    });
  };

  // login handler

  async function loginHandler() {
    if ([loginDetails?.userName, loginDetails?.password].some((item) => item?.trim() == "")) {
      return toast.error("all fields are required!!");
    }
    setLoader(true);
    await axios({
      method: "post",
      url: `${BACKEND_URL}/api/v1/users/verifyUser`,
      data: { userName: loginDetails?.userName, password: loginDetails?.password },
      withCredentials: true
    }).then(async (res) => {
      const isVarify = res?.data?.data?.isVarify;
      if (isVarify) {
        return await axios({
          method: "post",
          url: `${BACKEND_URL}/api/v1/users/login`,
          data: loginDetails,
          withCredentials: true
        }).then((res) => {
          setLoader(false);
          const user = res?.data?.data?.loggedInUser;
          if (res?.data?.success) {
            localStorage.setItem("user", JSON.stringify({ email: user?.email }));
            navigate.push("/");
            toast.success("login successfully!!");
          }
        }).catch((error) => {
          setLoader(false);
          toast.error(error?.response?.data?.message);
          setLoader(false);
        });
      } else {
        const email = res?.data?.data?.email;
        toast.error("you have to verify to login!!");
        await axios({
          method: "post",
          url: "https://socialmedia-mhye.onrender.com/api/v1/users/send-otp-mail",
          data: { email: email },
          withCredentials: true
        }).then((res) => {
          setLoader(false);
          toast.success("enter otp for verification!!");
          const urlData = {
            email: email,
            path: "/login"
          };
          const dataString = JSON.stringify(urlData);
          navigate.push(`/verify/${encodeURIComponent(dataString)} `);
        }).catch((error) => {
          setLoader(false);
          toast.error(error?.response?.data?.message);
        });
      }
    }).catch((error) => {
      toast.error(error?.response?.data?.message);
      setLoader(false);
    });
    // 
  }
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
        <button
          className="bg-[#4cb5f9] w-full rounded-lg h-[45px] text-white text-[16px] flex justify-center items-center"
          onClick={() => loginHandler()}
        >
          {loader ? <div className="loader"></div> : "Login"}
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
        <p className="text-[#00376b] cursor-pointer" onClick={() => navigate.push("/forget-password")}>Forget password?</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-8 px-[105px] mt-5" onClick={() => navigate.push("/signup")}>
        <p>
          Do not have a account?
          <span className="text-[#0095f6] cursor-pointer">Sign up.</span>
        </p>
      </div>
    </div>
  );
};
