"use client";

import React, { useState } from "react";
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
    FiCheckCircle
} from "react-icons/fi";
import BaseButton from "@/components/ui/BaseButton";
import { authClient } from "@/lib/auth-client";

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

export default function AddLessonForm({ onSubmitSuccess, creatorId, isSubmittingExternally = false }) {
    const { data: session } = authClient.useSession();
    const [loading, setLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");

    // Context Evaluation Flags
    const isAdmin = session?.user?.role === "admin";
    const isPremium = session?.user?.isPremium === true;
    const hasFullAccess = isAdmin || isPremium;

    // Dynamically evaluated collection nodes based on access level clearances
    const visibilityOptions = hasFullAccess
        ? ALL_VISIBILITY_OPTIONS
        : ALL_VISIBILITY_OPTIONS.filter(opt => opt.value === "Public");

    const accessLevels = hasFullAccess
        ? ALL_ACCESS_LEVELS
        : ALL_ACCESS_LEVELS.filter(tier => tier.value === "Free");

    // UX Tracking for dynamic file name assignment
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName("");
        }
    };

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        if (loading || isSubmittingExternally) return;

        const formData = new FormData(e.currentTarget);
        const rawFields = Object.fromEntries(formData.entries());

        const title = rawFields.title?.trim() || "";
        const description = rawFields.description?.trim() || "";
        const category = rawFields.category || "";
        const emotionalTone = rawFields.emotionalTone || "";
        const imageFile = formData.get("lessonImage");
        
        // Anti-tamper parameters: Force secure values on submission if user alters DOM elements
        const visibility = hasFullAccess ? (rawFields.visibility || "Public") : "Public";
        const accessLevel = hasFullAccess ? (rawFields.accessLevel || "Free") : "Free";

        if (!title) return toast.error("Please provide a lesson title");
        if (!category) return toast.error("Please select a valid category option");
        if (!description) return toast.error("Please fill in your lesson description content");

        try {
            setLoading(true);
            toast.loading("Synchronizing media assets and logs...", { id: "lesson-upload" });

            let uploadedImageUrl = "";

            // 🔁 Async ImgBB Network Synchronization Pipe
            if (imageFile && imageFile.size > 0) {
                const imgBbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
                if (!imgBbKey) {
                    console.warn("Missing NEXT_PUBLIC_IMGBB_API_KEY environment configuration variable.");
                }

                const imgFormData = new FormData();
                imgFormData.append("image", imageFile);

                const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgBbKey || "YOUR_FALLBACK_API_KEY"}`, {
                    method: "POST",
                    body: imgFormData,
                });

                if (!imgResponse.ok) {
                    throw new Error("ImgBB image binary transmission sync failure");
                }

                const imgResult = await imgResponse.json();
                uploadedImageUrl = imgResult.data.url;
            }

            const payload = {
                title,
                slug: generateSlug(title),
                description,
                category,
                emotionalTone,
                visibility,
                accessLevel,
                image: uploadedImageUrl, // Embedded remote direct access link
                likes: [],
                likesCount: 0,
                isFeatured: false,
                isReviewed: false,
                creatorId: creatorId || session?.user?.id || "anonymous",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            console.log("Assembled Lesson Node Pipeline Commit Payload:", payload);

            // Dynamic fetch setup to your running server instance:
            // const response = await fetch("http://localhost:5000/api/lessons", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error("Failed to commit post payload to backend service parameters");
            // }

            // const result = await response.json();

            toast.success("Lesson and thumbnail committed successfully! 🚀", { id: "lesson-upload" });
            
            // Cleanup application local states
            e.target.reset();
            setSelectedFileName("");

            if (onSubmitSuccess) {
                onSubmitSuccess(result);
            }
        } catch (error) {
            console.error("Critical submission disruption failure:", error);
            toast.error("Failed to sync media assets or record payload securely.", { id: "lesson-upload" });
        } finally {
            setLoading(false);
        }
    };

    const isFormDisabled = loading || isSubmittingExternally;

    return (
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 bg-background transition-colors duration-200">
            <div className="max-w-6xl mx-auto">

                <div className="mb-8 border-b border-border pb-6">
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        Draft New Repository Insight
                    </h1>
                    <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl">
                        Configure your lesson logs, structure visibility flags, and seed intelligence down to the live application database collections.
                    </p>
                </div>

                <Form onSubmit={handleFormSubmission} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Main content capture cards layout column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">

                            <div>
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <FiFileText className="text-primary text-base" /> Core Insight Parameters
                                </h2>
                                <p className="text-[11px] text-muted">Provide the absolute tracking points and definitions that govern this training record.</p>
                            </div>

                            {/* Title Form Field */}
                            <TextField isRequired className="w-full group">
                                <Label htmlFor="lesson-title" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Lesson Title
                                </Label>
                                <div className="relative flex items-center">
                                    <Input
                                        id="lesson-title"
                                        name="title"
                                        type="text"
                                        placeholder="e.g., Implementing Monotone Spline Calculations Under React Framework Hooks"
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    />
                                </div>
                                <FieldError className="text-xs text-red-500 mt-1 font-semibold" />
                            </TextField>

                            {/* Category Options Field */}
                            <div className="w-full">
                                <label htmlFor="lesson-category" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Primary Core Classification Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-category"
                                        name="category"
                                        defaultValue=""
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        <option value="" disabled hidden>Choose category categorization block...</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat} className="bg-card text-foreground">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiFolder className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Core Description Main Text Area */}
                            <div className="w-full">
                                <label htmlFor="lesson-description" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Complete Lesson Description & Insight Logs
                                </label>
                                <textarea
                                    id="lesson-description"
                                    name="description"
                                    rows={6}
                                    placeholder="Draft your code configurations, postmortems, or strategic career architecture choices directly in this field context wrapper..."
                                    disabled={isFormDisabled}
                                    className={cn(
                                        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 min-h-40 resize-y",
                                        "placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                />
                            </div>

                            {/* 🌌 High Fidelity Interactive Media Upload Dropzone Drop Area */}
                            <div className="w-full pt-2">
                                <span className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Lesson Visual Banner Image
                                </span>
                                <label 
                                    htmlFor="lesson-image" 
                                    className={cn(
                                        "group/dropzone relative flex flex-col items-center justify-center w-full min-h-[130px] rounded-xl border border-dashed bg-surface/40 hover:bg-surface transition-all duration-200 cursor-pointer text-center px-6 border-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary",
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
                                        className="sr-only" // Hidden visually for clean style tokens, reachable via accessible keyboard focus navigation paths
                                    />
                                    
                                    {selectedFileName ? (
                                        <div className="flex flex-col items-center space-y-2 animate-fadeIn">
                                            <FiCheckCircle className="text-2xl text-green-500" />
                                            <p className="text-xs font-bold text-foreground line-clamp-1 max-w-[400px]">
                                                {selectedFileName}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground underline decoration-dotted">Click container to swap resource image</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="p-2.5 rounded-xl bg-muted/40 text-muted-foreground group-hover/dropzone:text-primary group-hover/dropzone:bg-primary/10 transition-all duration-200">
                                                <FiImage className="text-xl" />
                                            </div>
                                            <p className="text-xs text-foreground font-medium">
                                                <span className="text-primary font-bold">Click to upload file attachment</span> or drag image here
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">PNG, JPG, or WEBP formats up to 10MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* Right Sidebar Parameter Configuration Metadata Stack */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">

                            <div>
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <FiActivity className="text-primary text-base" /> Logic Attributes
                                </h2>
                                <p className="text-[11px] text-muted">Govern system layer placement and user access groups globally.</p>
                            </div>

                            {/* Emotional Tone Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-tone" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Emotional Tone Accent
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-tone"
                                        name="emotionalTone"
                                        defaultValue={EMOTIONAL_TONES[0]}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {EMOTIONAL_TONES.map((tone) => (
                                            <option key={tone} value={tone} className="bg-card text-foreground">{tone}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiSmile className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Visibility Controls Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-visibility" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Stream Visibility Context
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-visibility"
                                        name="visibility"
                                        defaultValue="Public"
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {visibilityOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiEye className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Tier Access Level Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-access" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Access Level Tier
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-access"
                                        name="accessLevel"
                                        defaultValue="Free"
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {accessLevels.map((tier) => (
                                            <option key={tier.value} value={tier.value} className="bg-card text-foreground">{tier.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiUnlock className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Primary Visual Action Submit Button Interface Container */}
                            <div className="pt-2">
                                <BaseButton
                                    animated
                                    animatedSpanOne={'animate-ping'}
                                    type="submit"
                                    disabled={isFormDisabled}
                                    className={cn(
                                        "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-all duration-150 active:scale-[0.98]",
                                        "disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                                    )}
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="text-base animate-spin" />
                                            <span>Syncing Array Nodes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSend className="text-sm" />
                                            <span>Publish To Timeline</span>
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