import { cn } from "@/lib/utils";

// ======================================================
// Reusable Responsive Container Component
// ======================================================
// Purpose:
// This component keeps website content centered
// and gives consistent horizontal spacing.
//
// Benefits:
// - Reusable in every section
// - Keeps layout clean and responsive
// - Avoids repeating Tailwind classes everywhere
//
// Example Use:
// <Container>
//    <Hero />
// </Container>
//
const Container = ({ children, className }) => {
    return (
        <div
            className={cn(

                // =========================================
                // Default Container Styles
                // =========================================

                // max-w-350
                // Maximum width of the container
                // Prevents content from becoming too wide
                "max-w-350",

                // mx-auto
                // Horizontally center the container
                "mx-auto",

                // Responsive horizontal padding
                // Small devices   => px-4
                // Medium devices  => px-5
                // Large devices   => px-6
                // Extra large     => no padding
                "px-4 md:px-5 lg:px-6 xl:px-0",

                // =========================================
                // Additional Custom Classes
                // =========================================
                // Allows parent components to pass
                // extra Tailwind classes dynamically
                //
                // Example:
                // <Container className="bg-red-500" />
                className
            )}
        >

            {/* Render all nested child components */}
            {children}

        </div>
    );
};

export default Container;