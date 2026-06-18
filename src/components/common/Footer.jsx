import Link from "next/link";
import Container from "../shared/Container";
import Logo from "../ui/Logo";
import { FaDiscord, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { company, explore, support } from "@/lib/navLinks";


const Footer = () => {
    return (
        <section className="bg-card py-10">
            <Container>
                <footer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-10 md:gap-4">
                    <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-3">
                        <Logo />
                        <div>
                            <h3 className="text-muted text-sm">Real stories. Life lessons. Lasting impact.</h3>
                        </div>
                        <div className="flex gap-4 mt-3 items-center">
                            <Link href={'/'} className="group transition duration-300">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-sm text-muted group-hover:text-[#1DA1F2] transition-colors duration-300">
                                    <FaTwitter className="text-xl" />
                                </div>
                            </Link>

                            <Link href={'/'} className="group transition duration-300">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-sm text-muted group-hover:text-[#0077B5] transition-colors duration-300">
                                    <FaLinkedinIn className="text-xl" />
                                </div>
                            </Link>

                            <Link href={'/'} className="group transition duration-300">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-sm text-muted group-hover:text-[#5865F2] transition-colors duration-300">
                                    <FaDiscord className="text-xl" />
                                </div>
                            </Link>

                            <Link href={'/'} className="group transition duration-300">
                                <div className="w-8 h-8 bg-background rounded-md flex justify-center items-center shadow-sm text-muted group-hover:text-[#FF0000] transition-colors duration-300">
                                    <FaYoutube className="text-xl" />
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