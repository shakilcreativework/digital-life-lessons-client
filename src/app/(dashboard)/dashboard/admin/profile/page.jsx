"use client";

import BaseButton from "@/components/ui/BaseButton";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import Image from "next/image";

import { BsFillPencilFill } from "react-icons/bs";
import { FiUserCheck } from "react-icons/fi";
import { MdOutlineMarkEmailRead } from "react-icons/md";

export default function ProfileCard() {

    // ==========================================
    // Get current logged-in user session data
    // ==========================================
    const { data: session } = authClient.useSession();

    return (
        // ==========================================
        // Main Wrapper
        // Full screen center aligned layout
        // ==========================================
        <div className="lg:py-16 flex items-center justify-center">

            {/* Card Container */}
            <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-card border border-border shadow-xs">

                {/* ==========================================
                   Top Gradient Banner Section
                ========================================== */}
                {/* <div className="relative h-32 bg-linear-to-r from-orange-400 to-red-500"> */}
                <div className="relative h-32 bg-[linear-gradient(to_right,rgba(255,255,255,0.1),rgba(224,122,95,0.35),rgba(255,255,255,0.05)),url('https://i.ibb.co.com/j9RXKsVb/absolutvision-82-Tp-Eld0-e4-unsplash.jpg')] bg-cover bg-center w-full">

                    {/* ==========================================
                       User Avatar
                       Positioned overlapping banner & content
                    ========================================== */}
                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-surface overflow-hidden flex items-center justify-center">

                        {/* Show user uploaded image */}
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt="User Avatar"
                                width={80}
                                height={80}
                                priority
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            // Fallback avatar if no image found
                            <Avatar className="w-full h-full">

                                <Avatar.Image
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
                                    alt="Default Avatar"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />

                            </Avatar>
                        )}
                    </div>
                </div>

                {/* ==========================================
                   Profile Content Section
                ========================================== */}
                <div className="pt-14 pb-6 px-6">

                    {/* User Name */}
                    <h2 className="text-2xl font-semibold text-foreground">
                        {session?.user?.name}
                    </h2>

                    {/* User Email */}
                    <div className="flex items-center gap-2 text-foreground mt-1">

                        <MdOutlineMarkEmailRead />

                        <span className="text-sm break-all">
                            {session?.user?.email}
                        </span>

                    </div>

                    {/* ==========================================
                       User Information Cards
                    ========================================== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                        {/* Display Name Card */}
                        <div className="bg-surface-2 rounded-2xl p-4">

                            <p className="text-xs text-muted mb-2">
                                DISPLAY NAME
                            </p>

                            <div className="flex items-center gap-2 text-foreground font-medium">

                                <FiUserCheck />

                                <span className="line-clamp-1">
                                    {session?.user?.name}
                                </span>

                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-surface-2 rounded-2xl p-4">

                            <p className="text-xs text-muted mb-2">
                                EMAIL
                            </p>

                            <div className="flex items-center gap-2 text-foreground font-medium">

                                <MdOutlineMarkEmailRead />

                                <span className="line-clamp-1">
                                    {session?.user?.email}
                                </span>

                            </div>
                        </div>

                    </div>

                    {/* ==========================================
                       Update Profile Button
                    ========================================== */}
                    <div className="mt-6">

                        <BaseButton
                            as="link"
                            href="/dashboard/admin/update-profile"
                            text="Update Profile"
                            leftIcon={<BsFillPencilFill />}
                            animated
                            animatedSpanOne="animate-ping"
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}