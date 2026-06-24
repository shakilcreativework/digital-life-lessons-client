
import Container from "@/components/shared/Container";
import EmptyState from "@/components/ui/EmptyState"; 
import PublicLessonsDirectory from "@/components/ui/PublicLessonsDirectory";
import { getAllLessons } from "@/lib/actions/lessons";

const PublicPage = async () => {
    const lessons = await getAllLessons();

    return (
        <main className="pt-14 pb-36">
            <Container>
                {!lessons || lessons.length === 0 ? (
                    <div className="w-full py-12 flex justify-center items-center">
                        <EmptyState />
                    </div>
                ) : (
                    <PublicLessonsDirectory initialLessons={lessons} itemsPerPage={8} />
                )}
            </Container>
        </main>
    );
};

export default PublicPage;