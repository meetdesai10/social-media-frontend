"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DashBoard from "./(pages)/dashboard/page";

export default function Page() {
  const router = useRouter();
  // check uswr login or not

  const handleStorageChange = useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      return router.push("/login");
    }

    window.addEventListener("storage", () => {
      if (!localStorage.getItem("user")) {
        return router.push("/login");
      }
    });

    return () => {
      window.removeEventListener("storage", () => {
        if (!localStorage.getItem("user")) {
          return router.push("/login");
        }
      });
    };
  }, [router]); // Add router to dependency array
  return (
    <div>
      <DashBoard />
    </div>
  );
}
