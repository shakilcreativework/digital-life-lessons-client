import { FaQuoteLeft } from "react-icons/fa";
import Container from "../shared/Container";
import { Avatar } from "@heroui/react";


const RealPeople = () => {

    return (
        <section className="py-20 md:py-24">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4 lg:gap-6">
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">Real People. <br className="hidden md:hidden lg:block" /> Real Impact.</h1>
                        </div>
                        <p className=" lg:text-lg xl:text-2xl text-muted">Join a global community that <br className="hidden xl:inline-flex" /> learns, grows, and supports <br className="hidden xl:inline-flex" /> each other every day.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-4 mt-10">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">50K+</h1>
                                <p className="text-muted">Members</p>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">15K+</h1>
                                <p className="text-muted">Stories Shared</p>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">120K+</h1>
                                <p className="text-muted">Comments</p>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">90+</h1>
                                <p className="text-muted">Countries</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 xl:p-6 bg-card rounded-2xl flex flex-col border border-border justify-between">
                        <div className="space-y-4">
                            <FaQuoteLeft className="text-green-600 text-2xl" />
                            <h4 className="text-muted line-clamp-5">The stories here remind me that I&apos;m not alone. Every lesson pushes me to be better.</h4>
                        </div>
                        <div className="flex gap-3.5 items-center">
                            <Avatar size="lg">
                                <Avatar.Image
                                    referrerPolicy="no-referrer"
                                    alt={"User Name"}
                                    src={"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                                />
                                <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <h3 className="text-foreground text-xl capitalize font-medium">Daniel M.</h3>
                                <span className="text-muted text-sm">Student</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 xl:p-6 bg-card rounded-2xl flex flex-col border border-border justify-between">
                        <div className="space-y-4">
                            <FaQuoteLeft className="text-pink-600 text-2xl" />
                            <h4 className="text-muted line-clamp-5">I&apos;ve learned more from real people&apos;s experiences than any book or course.</h4>
                        </div>
                        <div className="flex gap-3.5 items-center">
                            <Avatar size="lg">
                                <Avatar.Image
                                    referrerPolicy="no-referrer"
                                    alt={"User Name"}
                                    src={"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                                />
                                <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <h3 className="text-foreground text-xl capitalize font-medium">Sophia L.</h3>
                                <span className="text-muted text-sm">Marketing Manager</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 xl:p-6 bg-card rounded-2xl flex flex-col border border-border justify-between">
                        <div className="space-y-4">
                            <FaQuoteLeft className="text-blue-600 text-2xl" />
                            <h4 className="text-muted line-clamp-5">This community is pure motivation and positive energy</h4>
                        </div>
                        <div className="flex gap-3.5 items-center">
                            <Avatar size="lg">
                                <Avatar.Image
                                    referrerPolicy="no-referrer"
                                    alt={"User Name"}
                                    src={"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                                />
                                <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <h3 className="text-foreground text-xl capitalize font-medium">Kevin P.</h3>
                                <span className="text-muted text-sm">Softwore Engineer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default RealPeople;