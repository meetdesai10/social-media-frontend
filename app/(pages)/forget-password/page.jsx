"use client";
import React, { useEffect, useState } from 'react';
import { instaLogo } from '@/app/images/Image';
import Image from 'next/image';
import { toast } from 'sonner';
import validator from 'validator';
import axios from 'axios';
import { BACKEND_URL } from '@/app/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgetPassword() {
    const navigate = useRouter();
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState("");

    // forgetPasswordHandler

    async function forgetPasswordHandler() {
        if (!email) {
            return toast.error("please enter email!!");
        }
        if (!validator.isEmail(email)) {
            return toast.error("please enter valid email!!");
        }
        setLoader(true);
        await axios({
            method: "post",
            url: `${BACKEND_URL}/api/v1/users/send-otp-mail`,
            data: { email: email },
            withCredentials: true
        }).then((res) => {
            setLoader(false);
            toast.success("enter otp for verification!!");
            const urlData = {
                email: email,
                path: "/set-password"
            };
            const dataString = JSON.stringify(urlData);

            navigate.push(`/verify/${encodeURIComponent(dataString)}`);
        }).catch((error) => {
            setLoader(false);
            toast.error(error?.response?.data?.message);
        });
    }
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate.push("/dashboard");
        }
    }, []);
    return (
        <div className="bg-white flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-10 px-12">
                <Image src={instaLogo} className="w-[250px] py-10" alt="logo" />
                <input
                    type="text"
                    placeholder="enter email"
                    name="userName"
                    className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
                    value={email}
                    onChange={(e) => setEmail(e?.target?.value)}
                />
                <button
                    onClick={() => forgetPasswordHandler()}
                    className="bg-[#4cb5f9] w-full rounded-lg h-[45px] text-white text-[16px] flex justify-center items-center"
                >
                    {loader ? <div className="loader"></div> : "send otp"}
                </button>
                <Link href={"/login"}>

                    <p>Bacl to Login</p>
                </Link>
            </div>
        </div>
    );
}
