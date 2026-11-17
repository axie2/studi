"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

import CourseSidebar from "./CourseSidebar";
import MatchResults from "./MatchResults";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [openCourse, setOpenCourse] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [userForms, setUserForms] = useState({});
    const [userData, setUserData] = useState(null);
    const [currentMatches, setCurrentMatches] = useState([]);

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Fetch user information
    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `/api/users?email=${encodeURIComponent(session.user.email)}`,
                );
                const data = await res.json();

                if (!data._id) {
                    console.error("User data not found");
                    return;
                }

                setUserData(data);
                localStorage.setItem("userId", data._id);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUser();
    }, [session]);

    // Fetch forms submitted by the current user
    useEffect(() => {
        if (!userData?._id) return;

        const fetchForms = async () => {
            try {
                const response = await fetch(
                    `/api/form?userId=${userData._id}`,
                );
                const data = await response.json();

                if (data.success) {
                    setUserForms(data.forms);
                } else {
                    console.error("Failed to load forms");
                }
            } catch (err) {
                console.error("Error fetching forms:", err);
            }
        };

        fetchForms();
    }, [userData]);

    // Fetch matches associated with a selected form
    const handleFormClick = async (form) => {
        setSelectedForm(form);
        setCurrentMatches([]);

        try {
            const response = await fetch(`/api/matches?targetForm=${form._id}`);
            const data = await response.json();

            if (data.success && data.matchBatch?.bestMatches) {
                setCurrentMatches(data.matchBatch.bestMatches);
            }
        } catch (err) {
            console.error("Error fetching matches:", err);
        }
    };

    // Expand or collapse a course in the sidebar
    const handleCourseClick = (course) => {
        setOpenCourse((prev) => (prev === course ? null : course));
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "calc(100vh - 64px)",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                backgroundColor: "#f5f7fa",
            }}
        >
            <CourseSidebar
                userForms={userForms}
                openCourse={openCourse}
                selectedForm={selectedForm}
                onCourseClick={handleCourseClick}
                onFormClick={handleFormClick}
            />

            <MatchResults
                selectedForm={selectedForm}
                currentMatches={currentMatches}
            />
        </Box>
    );
}
