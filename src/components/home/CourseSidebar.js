"use client";

import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Divider,
} from "@mui/material";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import theme from "@/utils/theme";

export default function CourseSidebar({
    userForms,
    openCourse,
    selectedForm,
    onCourseClick,
    onFormClick,
}) {
    return (
        <Box
            sx={{
                flex: "0 0 35%",
                backgroundColor: "#ffffff",
                borderRight: `1px solid ${theme.palette.divider || "#ddd"}`,
                p: 3,
                overflowY: "auto",
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: "#002d45", mb: 3 }}
            >
                My Match Runs
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <List component="nav">
                {Object.entries(userForms).map(([course, forms]) => (
                    <Box key={course} sx={{ mb: 2 }}>
                        <ListItemButton
                            onClick={() => onCourseClick(course)}
                            sx={{
                                borderRadius: 2,
                                p: 2,
                                boxShadow:
                                    openCourse === course
                                        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                                        : "0 1px 3px rgba(0,0,0,0.05)",
                                backgroundColor:
                                    openCourse === course
                                        ? "#e3f2fd"
                                        : "#fafafa",
                                "&:hover": {
                                    backgroundColor: "#d8f3dc",
                                    transform: "translateY(-1px)",
                                },
                                transition: "all 0.25s ease",
                            }}
                        >
                            <ListItemText
                                primary={course}
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                }}
                            />

                            {openCourse === course ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItemButton>

                        <Collapse
                            in={openCourse === course}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                {forms.map((form) => (
                                    <ListItemButton
                                        key={form._id}
                                        sx={{
                                            pl: 5,
                                            my: 1,
                                            borderRadius: 2,
                                            backgroundColor:
                                                selectedForm?._id === form._id
                                                    ? "#bbf0d7"
                                                    : "#f9f9f9",
                                            "&:hover": {
                                                backgroundColor: "#c9f2df",
                                                transform: "translateX(2px)",
                                            },
                                            transition: "all 0.2s ease",
                                        }}
                                        selected={
                                            selectedForm?._id === form._id
                                        }
                                        onClick={() => onFormClick(form)}
                                    >
                                        <ListItemText
                                            primary={`Form ${form._id}`}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </Box>
                ))}
            </List>
        </Box>
    );
}
