import { IoBookOutline } from "react-icons/io5";
import Container from "../shared/Container";
import InfoCard from "../ui/InfoCard";
import { FiUser } from "react-icons/fi";
import { GiLaurelCrown } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { RiShareForwardLine } from "react-icons/ri";


const InfoSesson = () => {
    return (
        <section className="py-20 md:py-24">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
                    <InfoCard icon={<IoBookOutline />} title={'Browse Lessons'} para={'Explore stories and lessons or mindset, career, relations, health, and more.'} />
                    <InfoCard icon={<FiUser />} title={'User Profiles'} para={'Build your profile, share your journey, and connect with like minded people.'} />
                    <InfoCard icon={<GiLaurelCrown className="text-amber-500 dark:text-yellow-500 drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)] dark:drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-all duration-300" />} title={'Premium Content'} para={'Unlock in depth stories, exclusive interviews, and members only resources.'} />
                    <InfoCard icon={<IoMdHeartEmpty />} title={'Like & Comment'} para={'Engage with stories throught likes, comments, and meaningful conversions.'} />
                    <InfoCard icon={<RiShareForwardLine />} title={'Share & Inspire'} para={'Share lessons across platforms and inspire someone who needs to hear it.'} />
                </div>
            </Container>
        </section>
    );
};

export default InfoSesson;