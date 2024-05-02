"use client";
import React, { useEffect, useState } from 'react';
import { instaLogo } from '@/app/images/Image';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '@/app/config';

export default function Verify({ params }) {
    const email = JSON.parse(decodeURIComponent(params?.email));
    const [otp, setOtp] = useState(undefined);
    const router = useRouter();
    const { pathname } = router;
    const [loader, setLoader] = useState(false);
    // const userEmail = router.query.email;

    // saved otp in state 
    function verifyOnchangeHandler(e) {
        const { value } = e?.target;
        const regex = /^[0-9\b]+$/;
        if (!regex.test(value)) {
            return toast.error("only number can be accepted!!");
        }
        setOtp(value);
    }

    // verify handler 
    async function verifyHandler() {
        setLoader(true);
        await axios({
            method: "post",
            url: `${BACKEND_URL}/api/v1/users/verify-otp/${otp}`,
            data: { email: email?.email },
            withCredentials: true
        }).then((res) => {
            setLoader(false);
            toast.success("otp verification successfully!!");
            if (email?.path == "/login") {
                router.push(`${email?.path}`);
            } else {
                router.push(`${email?.path}/${email?.email}`);
            }
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
        <div>
            <div className="bg-white flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col justify-center items-center gap-5 border-[1px] border-[#dbdbdb] py-10 px-12">
                    <Image src={instaLogo} className="w-[250px] py-10" alt="logo" />

                    <input
                        type="text"
                        placeholder="enter otp"
                        className="border-[1px] border-[#dbdbdb] py-2 px-2 outline-[#dad7d7] w-[350px]"
                        name="otp"
                        onChange={(e) => verifyOnchangeHandler(e)}
                    />
                    <button
                        className="bg-[#4cb5f9] w-full rounded-lg h-[45px] text-white text-[16px] flex justify-center items-center"
                        onClick={() => verifyHandler()}
                    >
                        {loader ? <div className="loader"></div> : "Verified"}
                    </button>
                </div>

            </div>
        </div>
    );
}
