import React, { useState } from "react";
import PropTypes from "prop-types";

function HelpPageSteps({ steps }) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = () => {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    };

    const handlePrevStep = () => {
        setCurrentStep((prevStep) => (prevStep - 1 + steps.length) % steps.length);
    };

    return (
        <div className="help-page-step">
            <div aria-label="Previous Step">
                <i className="fa-solid fa-chevron-left" onClick={handlePrevStep}></i>
            </div>
            <div>
                <div>
                    <span>{currentStep + 1}</span>
                    <p>{steps[currentStep].name}</p>
                </div>
                <div style={{ backgroundImage: `url(${steps[currentStep].image}`}} />
            </div>
            <div aria-label="Next Step">
                <i className="fa-solid fa-chevron-right" onClick={handleNextStep}></i>
            </div>
        </div>
    )
}

HelpPageSteps.propTypes = {
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            image: PropTypes.string
        })
    )
}

export default HelpPageSteps