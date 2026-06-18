"use client";

import Link from "next/link";
import { navLinks } from "@/lib/navLinks";
import { IoClose, IoLogInSharp, IoLogOutSharp } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import Container from "../shared/Container";
import { ThemeSwitch } from "../shared/ThemeSwitch";
import BaseButton from "../ui/BaseButton";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    // Initialize with your home path so a link is styled active immediately on load
    const [activeSection, setActiveSection] = useState("/");
    const links = navLinks;

    const handleMenu = () => {
        setOpen(!open);
    };

    // 1. Setup Intersection Observer to monitor matching layout nodes
    useEffect(() => {
        // Find HTML target element blocks by cleansing path patterns
        const sections = links
            .map((link) => {
                // Handles both hash formats ("#about") and page paths ("/about")
                const cleanId = link.path.replace(/^\/#|^\/|^#/, "");
                return cleanId ? document.getElementById(cleanId) : null;
            })
            .filter(Boolean);

        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -50% 0px", // High-accuracy window zone focal alignment tracker
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.id;
                    
                    // Match the precise path array item that corresponds to the visible section ID
                    const matchedLink = links.find((link) => {
                        const cleanPath = link.path.replace(/^\/#|^\/|^#/, "");
                        return cleanPath === targetId;
                    });

                    if (matchedLink) {
                        setActiveSection(matchedLink.path);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach((section) => observer.observe(section));

        // 💡 FALLBACK: Highlight Home ("/") if the user scrolls all the way back up to the top
        const handleScrollReset = () => {
            if (window.scrollY < 80) {
                setActiveSection("/");
            }
        };
        window.addEventListener("scroll", handleScrollReset);

        return () => {
            sections.forEach((section) => observer.unobserve(section));
            window.removeEventListener("scroll", handleScrollReset);
        };
    }, [links]);

    // 2. Click handler to handle clean, smooth window scrolling transitions
    const handleScroll = (e, path) => {
        const cleanId = path.replace(/^\/#|^\/|^#/, "");
        const element = document.getElementById(cleanId);

        if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: "smooth" });
            setActiveSection(path);
            setOpen(false); // Close mobile menu drawer
            window.history.pushState(null, "", path);
        } else if (path === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection("/");
            setOpen(false);
            window.history.pushState(null, "", "/");
        }
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
                            {links.map((nav) => {
                                const isActive = activeSection === nav.path;
                                return (
                                    <li key={nav.name}>
                                        <Link
                                            onClick={(e) => handleScroll(e, nav.path)}
                                            href={nav.path}
                                            className={`text-sm font-medium transition-colors duration-300 relative py-1 block ${
                                                isActive
                                                    ? "text-purple-500 font-semibold"
                                                    : "text-muted hover:text-accent"
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

                        <div className="flex items-center gap-5">
                            <ThemeSwitch />
                            <div className="flex gap-3">
                                <BaseButton animated className={'hidden md:inline-flex'} text={'Login'} rightIcon={<IoLogInSharp className="text-2xl" />} />
                                <BaseButton animated className={'hidden md:inline-flex'} text={'Register'} rightIcon={<IoLogOutSharp className="text-2xl" />} />
                            </div>
                            <button
                                aria-label={open ? "Close Menu" : "Open Menu"}
                                aria-expanded={open}
                                onClick={handleMenu}
                                className="block lg:hidden rounded-full bg-card hover:text-accent p-2"
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
                    <div className={`grid transition-all duration-300 ease-in-out lg:hidden w-full ${
                        open
                            ? "grid-rows-[1fr] opacity-100 mt-4 pb-2"
                            : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}>
                        <div className="overflow-hidden">
                            <ul className="space-y-3 flex flex-col pt-2 border-muted/10">
                                {links.map((nav) => {
                                    const isActive = activeSection === nav.path;
                                    return (
                                        <li key={nav.name}>
                                            <Link
                                                onClick={(e) => handleScroll(e, nav.path)}
                                                href={nav.path}
                                                className={`text-sm font-medium transition-all duration-200 w-full block p-2.5 rounded-xl ${
                                                    isActive
                                                        ? "bg-purple-500/10 text-purple-400 font-semibold border-l-4 border-purple-500 pl-3"
                                                        : "text-muted hover:text-accent hover:bg-neutral-500/5"
                                                }`}
                                            >
                                                {nav.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                                <div className="flex gap-3 pt-2">
                                    <BaseButton animated className={'md:hidden inline-flex py-2'} text={'Login'} rightIcon={<IoLogInSharp className="text-2xl" />} />
                                    <BaseButton animated className={'md:hidden inline-flex py-2'} text={'Register'} rightIcon={<IoLogOutSharp className="text-2xl" />} />
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