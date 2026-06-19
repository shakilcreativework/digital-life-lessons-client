import Container from "../shared/Container";


const RealPeople = () => {
    return (
        <section className="py-20 md:py-24">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-4 lg:gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">Real People. <br /> Real Impact.</h1>
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
                </div>
            </Container>
        </section>
    );
};

export default RealPeople;