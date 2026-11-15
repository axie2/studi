"use client";

import { Box, Typography, Paper } from "@mui/material";
import MatchCard from "./MatchCard";

export default function MatchResults({ selectedForm, currentMatches }) {
    return (
        <Box
            sx={{
                flex: "1 1 65%",
                p: 5,
                overflowY: "auto",
            }}
        >
            {!selectedForm ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        color: "#555",
                        border: "1px dashed #ccc",
                        borderRadius: 3,
                        backgroundColor: "#fefefe",
                    }}
                >
                    <Typography variant="h6">
                        To get started, fill out the "Find a Study Buddy"
                        preference form.
                    </Typography>

                    <Typography variant="h6">
                        Then, select a course and one of your forms to see
                        matches.
                    </Typography>
                </Paper>
            ) : (
                <Box>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: "#002d45",
                            mb: 1,
                        }}
                    >
                        Study Buddy Matches
                    </Typography>

                    {currentMatches.length === 0 ? (
                        <Typography color="text.secondary">
                            No matches found
                        </Typography>
                    ) : (
                        <Box display="flex" flexWrap="wrap" gap={2}>
                            {currentMatches.map((match) => (
                                <MatchCard
                                    key={match.form._id}
                                    match={match}
                                    targetForm={selectedForm}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
