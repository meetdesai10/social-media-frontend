"use client";
import React, { useEffect, useState } from "react";
import { instaLogo } from "@/app/images/Image";
import Image from "next/image";
import { FaFacebookSquare } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/app/config";

export default function Signup() {
  const navigate = useRouter();
  const [loader, setLoader] = useState(false);
  const [signupDetails, setSignupDetails] = useState({
    userName: "",
    fristName: "",
    lastName: "",
    gender: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });
  // saved signup details
  const savedSignupDetailHandler = (e) => {
    const { name, value } = e?.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  };

  //   signup handler

  const signupHandler = async () => {
    // all conditions for fields

    if (
      [
        signupDetails?.userName,
        signupDetails?.password,
        signupDetails?.confirmPassword,
        signupDetails?.contactNo,
        signupDetails?.email,
        signupDetails?.fristName,
        signupDetails?.lastName,
        signupDetails?.gender,
      ].some((item) => item?.trim() == "")
    ) {
      return toast.error("All fields are required!!");
    }

    // check password or confirm password

    if (signupDetails?.password !== signupDetails?.confirmPassword) {
      return toast.error("password and confirm password does not matched!!");
    }

    // loader start
    setLoader(true);

    // call api  

    await axios({
      method: "post",
      url: `${BACKEND_URL}/api/v1/users/register`,
      data: signupDetails,
    })
      .then(async (res) => {
        if (res?.data?.success) {
          const email = res?.data?.data?.email;
          await axios({
            method: "post",
            url: `${BACKEND_URL}/api/v1/users/send-otp-mail`,
            data: { email: email }
          }).then((res) => {
            const urlData = {
              email: email,
              path: "/login"
            };
            const dataString = JSON.stringify(urlData);

            toast.success("enter otp for verification!!");
            navigate.push(`/verify/${encodeURIComponent(dataString)}`);
          }).catch((error) => {
            toast.error(error?.response?.data?.message);
          });
        }
        setLoader(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setLoader(false);
      });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate.push("/dashboard");
    }
  }, []);
  return (
    <div className="bg-white flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-10 px-12">
        <Image src={instaLogo} className="w-[250px] py-0" alt="logo" />
        <div className="flex items-center justify-center gap-4 cursor-pointer bg-[#385185] py-2 w-full rounded-lg">
          <FaFacebookSquare className="text-white text-[30px]" />
          <p className="text-white text-[18px]">Login With Facebook</p>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#dbdbdb]"></div>
          <p className="text-[#737373] px-5">OR</p>
          <div className="w-full h-[1px] bg-[#dbdbdb]"></div>
        </div>
        <input
          type="text"
          placeholder="username"
          name="userName"
          value={signupDetails?.userName}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="text"
          placeholder="fristname"
          name="fristName"
          value={signupDetails?.fristName}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="text"
          placeholder="lastname"
          name="lastName"
          value={signupDetails?.lastName}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="text"
          placeholder="email"
          name="email"
          value={signupDetails?.email}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="text"
          placeholder="contact No"
          name="contactNo"
          value={signupDetails?.contactNo}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="text"
          placeholder="gender"
          name="gender"
          value={signupDetails?.gender}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={signupDetails?.password}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />
        <input
          type="password"
          placeholder="confirm password"
          name="confirmPassword"
          value={signupDetails?.confirmPassword}
          className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
          onChange={savedSignupDetailHandler}
        />

        <button
          className="bg-[#4cb5f9] w-full rounded-lg h-[45px] text-white text-[16px] flex justify-center items-center"
          onClick={() => signupHandler()}
        >
          {loader ? <div className="loader"></div> : "Sign up"}
        </button>
      </div>
      <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-8 px-[105px] mt-5" onClick={() => navigate.push("/login")} >
        <p>
          Do not have a account?{" "}
          <span className="text-[#0095f6] cursor-pointer">Sign in.</span>
        </p>
      </div>
    </div>
  );
}
