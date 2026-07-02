"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // 🎯 Added for bulletproof path monitoring
import { navLinks } from "@/lib/navLinks";
import { IoClose, IoLogInSharp, IoLogOutSharp } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import Logo from "../ui/Logo";
import Container from "../shared/Container";
import { ThemeSwitch } from "../shared/ThemeSwitch";
import BaseButton from "../ui/BaseButton";
import { authClient } from "@/lib/auth-client";
import { CustomTrigger } from "../ui/CustomTrigger";
import { MdWorkspacePremium } from "react-icons/md";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname(); // 🎯 Tracks current URL path precisely
    const { data: session } = authClient.useSession();
    // console.log(session?.session?.token);

    // if user active and get from session then show public and private route
    const visibleLinks = navLinks.filter(nav => {
        if (session?.user) return true; // Show everything if logged in
        return nav.viewType === "public"; // Show only public if logged out
    });

    const handleMenu = () => {
        setOpen(!open);
    };

    return (
        <header className="sticky top-0 left-0 w-full py-2 z-50 backdrop-blur-lg bg-background/60 lg:shadow-2xs">
            <Container>
                <nav>
                    {/* Main Navbar Row */}
                    <div className="flex items-center justify-between w-full lg:w-auto">
                        <div>
                            <Logo />
                        </div>

                        {/* Desktop Navigation Links */}
                        <ul className="hidden lg:flex lg:gap-8 items-center">
                            {visibleLinks.map((nav) => {
                                // 🎯 Strict validation matching parameters to prevent bleed overlaps
                                const isActive = 
                                    nav.path === "/" 
                                        ? pathname === "/" 
                                        : pathname === nav.path || pathname.startsWith(nav.path + "/");

                                return (
                                    <li key={nav.name}>
                                        <Link
                                            onClick={() => setOpen(false)}
                                            href={nav.path}
                                            className={`text-sm font-medium transition-colors duration-300 relative py-1 block ${isActive
                                                ? "text-purple-500 font-semibold"
                                                : "text-muted hover:text-secondary"
                                                }`}
                                        >
                                            {nav.name}
                                            {/* Animated underscore active status marker line bar */}
                                            {isActive && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className={`flex ${session?.user ? 'gap-4' : ''} md:gap-5 items-center`}>
                            <ThemeSwitch />

                            {
                                session?.user
                                    ?
                                    <div className="md:gap-5 flex">
                                        {session?.user?.role === "admin"
                                            ?
                                            <BaseButton
                                                className={'py-2 hidden md:inline-flex'}
                                                animated
                                                animatedSpanOne={'animate-spin'}
                                                rightIcon={<MdWorkspacePremium />}
                                                text={'Admin'} />
                                            :
                                            session?.user?.isPremium
                                                ?
                                                <BaseButton
                                                    className={'py-2 hidden md:inline-flex'}
                                                    animated
                                                    animatedSpanOne={'animate-spin'}
                                                    rightIcon={<MdWorkspacePremium />}
                                                    text={'Premium'} />
                                                :
                                                <BaseButton
                                                    as="link"
                                                    href={'/pricing'}
                                                    className={'py-2 hidden md:inline-flex'}
                                                    animated
                                                    animatedSpanOne={'animate-spin'}
                                                    rightIcon={<MdWorkspacePremium />}
                                                    text={'Upgrade'} />
                                        }
                                        <div className="flex items-center gap-2">
                                            <CustomTrigger />
                                        </div>
                                    </div>
                                    :
                                    <div className="flex gap-3">
                                        <Link href={'/login'}>
                                            <BaseButton animated className={'hidden md:inline-flex py-2'} text={'Login'} rightIcon={<IoLogInSharp className="text-2xl" />} />
                                        </Link>
                                        <Link href={'/register'}>
                                            <BaseButton animated animatedSpanOne={'animate-spin'} className={'hidden md:inline-flex py-2'} text={'Register'} rightIcon={<IoLogOutSharp className="text-2xl" />} />
                                        </Link>
                                    </div>
                            }

                            <button
                                aria-label={open ? "Close Menu" : "Open Menu"}
                                aria-expanded={open}
                                onClick={handleMenu}
                                className="block lg:hidden rounded-full bg-card hover:text-secondary p-2"
                            >
                                <div className="relative w-6 h-6 flex justify-center items-center rounded-full shadow-2xs">
                                    {open ? (
                                        <IoClose className="absolute text-xl" />
                                    ) : (
                                        <AiOutlineMenu className="absolute text-xl" />
                                    )}
                                </div>
                            </button>
                        </div>

                    </div>

                    {/* Mobile Collapsible Dropdown Drawer */}
                    <div className={`grid transition-all duration-300 ease-in-out lg:hidden w-full ${open
                        ? "grid-rows-[1fr] opacity-100 mt-4 pb-2"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none"
                        }`}>
                        <div className="overflow-hidden">
                            <ul className="space-y-3 flex flex-col pt-2 border-muted/10">
                                {visibleLinks.map((nav) => {
                                    // 🎯 Strict mobile match evaluation logic rules
                                    const isActive = 
                                        nav.path === "/" 
                                            ? pathname === "/" 
                                            : pathname === nav.path || pathname.startsWith(nav.path + "/");

                                    return (
                                        <li key={nav.name}>
                                            <Link
                                                onClick={() => setOpen(false)}
                                                href={nav.path}
                                                className={`text-sm font-medium transition-all duration-200 w-full block p-2.5 rounded-xl ${isActive
                                                    ? "bg-purple-500/10 text-purple-400 font-semibold border-l-4 border-purple-500 pl-3"
                                                    : "text-muted hover:text-secondary hover:bg-neutral-500/5"
                                                    }`}
                                            >
                                                {nav.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                                <div className="">
                                    {
                                        session?.user
                                            ?
                                            <div className="flex gap-4 md:hidden">
                                                <BaseButton
                                                    as="link"
                                                    href={'/pricing'}
                                                    onClick={() => setOpen(false)}
                                                    className={'py-2'}
                                                    animated
                                                    animatedSpanOne={'animate-spin'}
                                                    rightIcon={<MdWorkspacePremium />}
                                                    text={'Upgrade'} />
                                            </div>
                                            :
                                            <div className="flex gap-3 pt-2">
                                                <Link href={'/login'} onClick={() => setOpen(false)}>
                                                    <BaseButton animated className={'md:hidden inline-flex py-2'} text={'Login'} rightIcon={<IoLogInSharp className="text-2xl" />} />
                                                </Link>
                                                <Link href={'/register'} onClick={() => setOpen(false)}>
                                                    <BaseButton animated animatedSpanOne={'animate-spin'} className={'md:hidden inline-flex py-2'} text={'Register'} rightIcon={<IoLogOutSharp className="text-2xl" />} />
                                                </Link>
                                            </div>
                                    }
                                </div>
                            </ul>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    );
};

export default Navbar;