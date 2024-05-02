"use client";
import { BACKEND_URL } from '@/app/config';
import { instaLogo } from '@/app/images/Image';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import validator from 'validator';

export default function SetPassword({ params }) {
    const router = useRouter();
    const email = decodeURIComponent(params?.email);
    const [newPasswordDetails, setNewPasswordDetails] = useState({
        newPassword: "",
        confirmPassword: "",
        email
    });
    const [loader, setLoader] = useState(false);
    // setNewPasswordDetailsHandler
    async function setNewPasswordDetailsHandler() {
        if (!validator.isEmail(email)) {
            return toast.error("do not get a valid email!!");
        }
        if (!(newPasswordDetails?.newPassword || newPasswordDetails?.confirmPassword)) {
            return toast.error("all fields required!!");
        }
        if (newPasswordDetails?.newPassword !== newPasswordDetails?.confirmPassword) {
            return toast.error("password and confirm password does not match!!");
        }
        setLoader(true);
        await axios({
            method: "post",
            url: `${BACKEND_URL}/api/v1/users/forget-password`,
            data: newPasswordDetails,
            withCredentials: true
        }).then((res) => {
            setLoader(false);
            toast.success("password reset successfully!!");
            router.push("/login");
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
                <Image src={instaLogo} className="w-[250px] py-5" alt="logo" />
                <h1 className='text-[20px]'>reset passwrod</h1>
                <input
                    type="password"
                    placeholder="Enter new password"
                    name="userName"
                    className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
                    value={newPasswordDetails?.newPassword}
                    onChange={(e) => setNewPasswordDetails({ ...newPasswordDetails, newPassword: e?.target?.value })}
                />
                <input
                    type="password"
                    placeholder="confirm password"
                    className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
                    name="password"
                    value={newPasswordDetails?.confirmPassword}
                    onChange={(e) => setNewPasswordDetails({ ...newPasswordDetails, confirmPassword: e?.target?.value })}
                />
                <button
                    onClick={() => setNewPasswordDetailsHandler()}
                    className="bg-[#4cb5f9] w-full rounded-lg h-[45px] text-white text-[16px] flex justify-center items-center"
                >
                    {loader ? <div className="loader"></div> : "Reset Password"}
                </button>

            </div>

        </div>
    );
}
