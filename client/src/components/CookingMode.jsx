import { useEffect, useState } from "react";

function CookingMode({
    recipeId,
    instructions
}) {
    const [cookingMode, setCookingMode] =
        useState(false);

    const [completedStep, setCompletedStep] =
        useState(-1); // must smaller 0 index(sentinel value)

    function splitInstructionsIntoSentences(text) {
        if (!text) return [];

        const segmenter = new Intl.Segmenter(
            "en",
            { granularity: "sentence" }
        );

        return Array.from(
            segmenter.segment(text),
            (segment) => segment.segment.trim()
        ).filter(Boolean);
    }

    function handleStepClick(index) {
        setCompletedStep(index);

        localStorage.setItem(
            `cooking-progress-${recipeId}`,
            index.toString()
        );
    }

    function handleResetCookingProgress() {
        setCompletedStep(-1);
        setCookingMode(false);

        localStorage.removeItem(
            `cooking-progress-${recipeId}`
        );
    }

    const instructionSteps =
        splitInstructionsIntoSentences(
            instructions
        );

    useEffect(() => {
        if (!recipeId) return;

        const savedProgress =
            localStorage.getItem(
                `cooking-progress-${recipeId}`
            );

        setCompletedStep(
            savedProgress !== null
                ? Number(savedProgress)
                : -1
        );

        setCookingMode(false);
    }, [recipeId]);

    return (
        <>
            <div className="cooking-mode-controls">
                {!cookingMode ? (
                    <button
                        type="button"
                        className="primary-button cooking-mode-button"
                        onClick={() => setCookingMode(true)}
                    >
                        {completedStep >= 0
                            ? "Continue cooking"
                            : "Start cooking"}
                    </button>
                ) : (
                    <div className="cooking-mode-panel">
                        <h3>Cooking Mode</h3>

                        <p className="cooking-mode-hint">
                            Tap a sentence to update your cooking progress.
                            <br />
                            Your progress is saved automatically on this device.
                        </p>

                        <button
                            type="button"
                            className="primary-button reset-cooking"
                            onClick={handleResetCookingProgress}
                        >
                            Reset cooking progress
                        </button>
                    </div>
                )}
            </div>
            <p className="cooking-instructions">
                {instructionSteps.map((step, index) => (
                    <span
                        key={index}
                        onClick={
                            cookingMode
                                ? () => handleStepClick(index)
                                : undefined
                        }
                        className={
                            cookingMode
                                ? index <= completedStep
                                    ? "cooking-text-completed"
                                    : "cooking-text-active"
                                : "cooking-text"
                        }
                    >
                        {step}{" "}
                    </span>
                ))}
            </p>
        </>
    )
}

export default CookingMode;