import Link from "next/link";
import Container from "../shared/Container";
import Logo from "../ui/Logo";
import { IoLogoGithub } from "react-icons/io";
import { FaDiscord, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { company, explore, support } from "@/lib/navLinks";


const Footer = () => {
    return (
        <section className="bg-card py-10">
            <Container>
                <footer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-4">
                    <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-2">
                        <Logo />
                        <div>
                            <h3 className="text-muted text-sm">Real stories. Life lessons. Lasting impact.</h3>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Link href={'/'} className="hover:text-purple-600 transition">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-xs">
                                    <IoLogoGithub className="text-xl" />
                                </div>
                            </Link>
                            <Link href={'/'} className="hover:text-purple-600 transition">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-xs">
                                    <FaLinkedinIn className="text-xl" />
                                </div>
                            </Link>
                            <Link href={'/'} className="hover:text-purple-600 transition">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-xs">
                                    <FaDiscord className="text-xl" />
                                </div>
                            </Link>
                            <Link href={'/'} className="hover:text-purple-600 transition">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-xs">
                                    <MdOutlineMarkEmailUnread className="text-xl" />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <ul className="flex flex-col gap-4">
                        <h3 className="text-foreground text-lg font-medium">Explore</h3>
                        <div className="flex flex-col gap-2">
                            {
                                explore.map((explore, index) => <li key={index}>
                                    <Link className="block text-sm text-muted hover:text-secondary transition" href={explore?.path}>{explore?.name}</Link>
                                </li>)
                            }
                        </div>
                    </ul>
                    <ul className="flex flex-col gap-4">
                        <h3 className="text-foreground text-lg font-medium">Explore</h3>
                        <div className="flex flex-col gap-2">
                            {
                                company.map((explore, index) => <li key={index}>
                                    <Link className="block text-sm text-muted hover:text-secondary transition" href={explore?.path}>{explore?.name}</Link>
                                </li>)
                            }
                        </div>
                    </ul>
                    <ul className="flex flex-col gap-4">
                        <h3 className="text-foreground text-lg font-medium">Explore</h3>
                        <div className="flex flex-col gap-2">
                            {
                                support.map((explore, index) => <li key={index}>
                                    <Link className="block text-sm text-muted hover:text-secondary transition" href={explore?.path}>{explore?.name}</Link>
                                </li>)
                            }
                        </div>
                    </ul>
                </footer>
            </Container>
        </section>
    );
};

export default Footer;