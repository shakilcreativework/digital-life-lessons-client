"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Form,
    TextField,
    Input,
    Label,
    FieldError
} from "@heroui/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
    FiFileText,
    FiFolder,
    FiSmile,
    FiEye,
    FiUnlock,
    FiSend,
    FiLoader,
    FiActivity,
    FiImage,
    FiCheckCircle,
    FiUser,
    FiMail
} from "react-icons/fi";
import BaseButton from "@/components/ui/BaseButton";
import { authClient } from "@/lib/auth-client";
import LoadingData from "@/components/ui/LoadingData";

const CATEGORIES = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned"
];

const EMOTIONAL_TONES = [
    "Motivational",
    "Sad",
    "Realization",
    "Gratitude"
];

const ALL_VISIBILITY_OPTIONS = [
    { value: "Public", label: "🌍 Public (Visible to everyone)" },
    { value: "Private", label: "🔒 Private (Personal draft space)" }
];

const ALL_ACCESS_LEVELS = [
    { value: "Free", label: "🆓 Free Access Tier" },
    { value: "Premium", label: "💎 Premium Access Tier" }
];

const generateSlug = (title) => {
    if (!title) return "";
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export default function EditLessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params?.id; 
    
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    
    // Engine State Operations Flags
    const [loading, setLoading] = useState(false);
    const [dataHydrating, setDataHydrating] = useState(true);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");

    // Form Managed Controlled States
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [emotionalTone, setEmotionalTone] = useState("Motivational");
    const [visibility, setVisibility] = useState("Public");
    const [accessLevel, setAccessLevel] = useState("Free");

    // Account Properties Configuration Layers
    const ownerName = session?.user?.name || "Authenticated Creator";
    const ownerEmail = session?.user?.email || "creator@domain.com";

    // Subscription & Authority Restrictions Check
    const isAdmin = session?.user?.role === "admin";
    const isPremium = session?.user?.isPremium === true;
    const hasFullAccess = isAdmin || isPremium;

    // Filters choices dynamically based on user subscription permissions
    const visibilityOptions = hasFullAccess
        ? ALL_VISIBILITY_OPTIONS
        : ALL_VISIBILITY_OPTIONS.filter(opt => opt.value === "Public");

    const accessLevels = hasFullAccess
        ? ALL_ACCESS_LEVELS
        : ALL_ACCESS_LEVELS.filter(tier => tier.value === "Free");

    // Fetch and Autofill Existing MongoDB Records
    useEffect(() => {
        if (sessionLoading || !lessonId) return;
        
        if (!session) {
            router.push("/login");
            return;
        }

        const fetchLessonData = async () => {
            try {
                setDataHydrating(true);
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const response = await fetch(`${baseUrl}/api/lessons/${lessonId}`);
                
                if (!response.ok) {
                    throw new Error("Unable to fetch lesson information from database logs.");
                }
                
                const result = await response.json();

                // Unwraps target fields directly out of your envelope configuration structure
                if (result.success && result.lesson) {
                    const lesson = result.lesson;

                    setTitle(lesson.title || "");
                    setCategory(lesson.category || "");
                    setDescription(lesson.description || "");
                    setEmotionalTone(lesson.emotionalTone || "Motivational");
                    setVisibility(lesson.visibility || "Public");
                    setAccessLevel(lesson.accessLevel || "Free");

                    if (lesson.image) {
                        setExistingImageUrl(lesson.image);
                        const nameExtract = lesson.image.split("/").pop();
                        setSelectedFileName(nameExtract || "current_banner_image.jpg");
                    }
                } else {
                    throw new Error(result.error || "Malformed lesson database document format.");
                }
            } catch (err) {
                console.error("Hydration Error:", err);
                toast.error("Failed to load your lesson metrics.");
                router.push("/dashboard/my-lessons");
            } finally {
                setDataHydrating(false);
            }
        };

        fetchLessonData();
    }, [lessonId, sessionLoading, session, router]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
        } else if (existingImageUrl) {
            const nameExtract = existingImageUrl.split("/").pop();
            setSelectedFileName(nameExtract || "current_banner_image.jpg");
        }
    };

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!title.trim()) return toast.error("Please provide a lesson title");
        if (!category) return toast.error("Please select a valid category");
        if (!description.trim()) return toast.error("Please write a detailed lesson description");

        try {
            setLoading(true);
            toast.loading("Updating lesson configurations...", { id: "edit-lesson-toast" });

            let finalImageUrl = existingImageUrl;
            const formData = new FormData(e.currentTarget);
            const imageFile = formData.get("lessonImage");

            // Process optional image asset delivery override if chosen
            if (imageFile && imageFile.size > 0) {
                const imgBbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
                const imgFormData = new FormData();
                imgFormData.append("image", imageFile);

                const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgBbKey}`, {
                    method: "POST",
                    body: imgFormData,
                });

                if (!imgResponse.ok) throw new Error("Image cloud upload failure.");
                const imgResult = await imgResponse.json();
                finalImageUrl = imgResult.data.url;
            }

            const payload = {
                title: title.trim(),
                slug: generateSlug(title),
                description: description.trim(),
                category,
                emotionalTone,
                visibility: hasFullAccess ? visibility : "Public",
                accessLevel: hasFullAccess ? accessLevel : "Free",
                image: finalImageUrl
            };

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${baseUrl}/api/lessons/${lessonId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Database log commit rejected.");

            toast.success("Lesson updated successfully! 🎉", { id: "edit-lesson-toast" });
            router.push("/dashboard/my-lessons");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Could not overwrite database record details.", { id: "edit-lesson-toast" });
        } finally {
            setLoading(false);
        }
    };

    const isFormDisabled = loading || dataHydrating;

    if (dataHydrating || sessionLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-foreground">
                <LoadingData text="Hydrating Lesson Data..." />
            </div>
        );
    }

    return (
        <main className="pb-20 transition-colors duration-200">
            <div className="w-full">

                <div className="mb-8 border-b border-border pb-6">
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        Edit Repository Insight
                    </h1>
                    <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl">
                        Modify your tracked lesson parameters, update layout options, and commit records directly back to database clusters.
                    </p>
                </div>

                <Form onSubmit={handleFormSubmission} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Main Parameters Inputs Stream */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">

                            {/* Section 1: Read-Only Identity Parameters */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border pb-6">
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-bold text-muted uppercase tracking-wide">
                                        Owner Name (Non-Editable)
                                    </label>
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm cursor-not-allowed select-none">
                                        <FiUser className="text-muted" />
                                        <span>{ownerName}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-bold text-muted uppercase tracking-wide">
                                        Owner Email (Non-Editable)
                                    </label>
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm cursor-not-allowed select-none">
                                        <FiMail className="text-muted" />
                                        <span className="truncate">{ownerEmail}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <FiFileText className="text-primary text-base" /> Core Insight Parameters
                                </h2>
                                <p className="text-[11px] text-muted">Provide the absolute tracking points and definitions that govern this training record.</p>
                            </div>

                            {/* Title Field Input */}
                            <TextField isRequired className="w-full group">
                                <Label htmlFor="lesson-title" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Lesson Title
                                </Label>
                                <div className="relative flex items-center">
                                    <Input
                                        id="lesson-title"
                                        name="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)} // Fixed: standard onchange handler
                                        placeholder="e.g., Implementing Monotone Spline Calculations Under React Framework Hooks"
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                                            "disabled:opacity-50"
                                        )}
                                    />
                                </div>
                                <FieldError className="text-xs text-red-500 mt-1 font-semibold" />
                            </TextField>

                            {/* Category Dropdown Selection Option */}
                            <div className="w-full">
                                <label htmlFor="lesson-category" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Primary Core Classification Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-category"
                                        name="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary pr-10 cursor-pointer",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        <option value="" disabled hidden>Choose category block...</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat} className="bg-card text-foreground">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                        <FiFolder className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Description Field Textarea */}
                            <div className="w-full">
                                <label htmlFor="lesson-description" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Complete Lesson Description & Insight Logs
                                </label>
                                <textarea
                                    id="lesson-description"
                                    name="description"
                                    rows={6}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Draft your code configurations or choice parameters here..."
                                    disabled={isFormDisabled}
                                    className={cn(
                                        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 min-h-40 resize-y",
                                        "focus:outline-none focus:border-primary key-focus",
                                        "disabled:opacity-50"
                                    )}
                                />
                            </div>

                            {/* Optional Banner Cloud Replacement Dropzone */}
                            <div className="w-full pt-2">
                                <span className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Lesson Visual Banner Image (Optional Asset Re-Upload)
                                </span>
                                <label
                                    htmlFor="lesson-image"
                                    className={cn(
                                        "group/dropzone relative flex flex-col items-center justify-center w-full min-h-32.5 rounded-xl border border-dashed bg-surface/40 hover:bg-surface transition-all duration-200 cursor-pointer text-center px-6 border-border context-focus",
                                        isFormDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
                                    )}
                                >
                                    <input
                                        id="lesson-image"
                                        name="lessonImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isFormDisabled}
                                        className="sr-only"
                                    />

                                    {selectedFileName ? (
                                        <div className="flex flex-col items-center space-y-2 animate-fadeIn">
                                            <FiCheckCircle className="text-2xl text-green-500" />
                                            <p className="text-xs font-bold text-foreground line-clamp-1 max-w-100">
                                                {selectedFileName}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground underline decoration-dotted">Click workspace container to change selection</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="p-2.5 rounded-xl bg-muted/40 text-muted-foreground group-hover/dropzone:text-primary group-hover/dropzone:bg-primary/10 transition-all duration-200">
                                                <FiImage className="text-xl" />
                                            </div>
                                            <p className="text-xs text-foreground font-medium">
                                                <span className="text-primary font-bold">Click to upload new replacement image</span> or drag file here
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">PNG, JPG, or WEBP up to 10MB (Leave blank to keep existing image)</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* Meta-Logic Sidebar Parameters Column */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">

                            <div>
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <FiActivity className="text-primary text-base" /> Logic Attributes
                                </h2>
                                <p className="text-[11px] text-muted">Govern system layer placement and user access groups globally.</p>
                            </div>

                            {/* Emotional Tone Accent Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-tone" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Emotional Tone Accent
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-tone"
                                        name="emotionalTone"
                                        value={emotionalTone}
                                        onChange={(e) => setEmotionalTone(e.target.value)}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary pr-10 cursor-pointer",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        {EMOTIONAL_TONES.map((tone) => (
                                            <option key={tone} value={tone} className="bg-card text-foreground">{tone}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                        <FiSmile className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Stream Visibility Selection */}
                            <div className="w-full">
                                <label htmlFor="lesson-visibility" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Stream Visibility Context
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-visibility"
                                        name="visibility"
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary pr-10 cursor-pointer",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        {visibilityOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>
                                        ))}
                                    </select>
                                    {!hasFullAccess && (
                                        <p className="text-[10px] text-amber-500 font-bold tracking-tight mt-1">
                                            ⚠️ Upgrade to Premium to toggle Private draft spacing layouts.
                                        </p>
                                    )}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                        <FiEye className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Access Tier Level Toggles */}
                            <div className="w-full">
                                <label htmlFor="lesson-access" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Access Level Tier
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-access"
                                        name="accessLevel"
                                        value={accessLevel}
                                        onChange={(e) => setAccessLevel(e.target.value)}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary pr-10 cursor-pointer",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        {accessLevels.map((tier) => (
                                            <option key={tier.value} value={tier.value} className="bg-card text-foreground">{tier.label}</option>
                                        ))}
                                    </select>
                                    {!hasFullAccess && (
                                        <p className="text-[10px] text-amber-500 font-bold tracking-tight mt-1">
                                            ⚠️ Upgrade to Premium subscription to lock/unlock Premium access layers.
                                        </p>
                                    )}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                        <FiUnlock className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Execution Commit Submit Button */}
                            <div className="pt-2">
                                <BaseButton
                                    animated
                                    animatedSpanOne={'animate-ping'}
                                    type="submit"
                                    disabled={isFormDisabled}
                                    className={cn(
                                        "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-all duration-150 active:scale-[0.98]",
                                        "disabled:opacity-60 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="text-base animate-spin" />
                                            <span>Saving Modifications...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSend className="text-sm" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </BaseButton>
                            </div>

                        </div>
                    </div>

                </Form>
            </div>
        </main>
    );
}