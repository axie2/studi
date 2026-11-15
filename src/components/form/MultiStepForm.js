"use client";

import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Step1 from "@/components/form/formSteps/step1";
import Step2 from "@/components/form/formSteps/step2";
import Step3 from "@/components/form/formSteps/step3";
import Step4 from "@/components/form/formSteps/step4";
import Step5 from "@/components/form/formSteps/step5";
import Step6 from "@/components/form/formSteps/step6";

// Labels displayed in the progress tracker
const steps = [
    "Instructions",
    "Course",
    "Personality",
    "Study Goals",
    "Study Environment",
    "Study Rhythm",
];

export default function MultiStepForm() {
    const [activeStep, setActiveStep] = useState(0); // Track the current step in the form
    const [formData, setFormData] = useState({}); // Store the user's responses across all form steps
    const router = useRouter();

    // Update form data whenever a user changes an input
    // The input's name is used as the key, and its value is stored
    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Move forward or backward through the form
    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    // Cancel form submission and return to the home page
    const handleCancel = () => {
        router.push("/");
    };

    // Submit the completed form to the backend
    const handleSubmit = async () => {
        // Retrieve the logged-in user's ID from local storage
        const userId = localStorage.getItem("userId");

        // Ensure a user ID is available before submitting
        if (!userId) {
            alert("Could not find your user ID. Please re-login.");
            return;
        }

        // Associate the submitted preferences with the logged-in user
        formData.userId = userId;

        // Save the form data in the database
        const response = await fetch("/api/form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        // Retrieve the newly created form's ID from the response
        const responseData = await response.json();

        // Attach the form ID so the matching API can identify this submission
        formData.id = responseData.id;

        // Send the submitted preferences to the matching API
        // to generate study buddy recommendations
        await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        // Return to the home page after a successful form submission
        if (response.ok) {
            router.push("/");
            alert("Form submitted successfully!");
        } else {
            const errorData = await response.json();
            alert(
                `Error submitting form: ${errorData.message || "Unknown error"}`,
            );
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* Display the user's progress through the form */}
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Render the component corresponding to the current step */}
            <Box sx={{ mt: 4 }}>
                {activeStep === 0 && <Step1 />}
                {activeStep === 1 && (
                    <Step2 formData={formData} onChange={onChange} />
                )}
                {activeStep === 2 && (
                    <Step3 formData={formData} onChange={onChange} />
                )}
                {activeStep === 3 && (
                    <Step4 formData={formData} onChange={onChange} />
                )}
                {activeStep === 4 && (
                    <Step5 formData={formData} onChange={onChange} />
                )}
                {activeStep === 5 && (
                    <Step6 formData={formData} onChange={onChange} />
                )}
            </Box>

            {/* Navigation buttons for moving between form steps */}
            <Box
                sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
                {/* Show Cancel on the first step and Back on subsequent steps */}
                {activeStep !== 0 ? (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                )}

                {/* Show Next until the final step, then allow submission */}
                {activeStep !== steps.length - 1 ? (
                    <Button
                        variant="contained"
                        // Require a course selection before proceeding past the first step
                        disabled={!formData.course && activeStep !== 0}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                )}
            </Box>
        </Box>
    );
}
