const validateForm = (formSelector, callback) => {
    console.log('Validating form...')

    const formElement = document.querySelector(formSelector);

    const validationOptions = [
        {
            attribute: 'required',
            isValid: input => input.value.trim() !== '',
            errorMessage: (input, label) => `${label.textContent} is required`
        },
        {
            attribute: 'pattern',
            isValid: input => {
                const patternRegex = new RegExp(input.pattern);
                return patternRegex.test(input.value);
            },
            errorMessage: (input, label) => `Not a valid ${label.textContent}`
        }
    ]

    const validateSingleFormGroup = formGroup => {
        const label = formGroup.querySelector('label')
        const input = formGroup.querySelector('input, textarea');
        const errorContainer = formGroup.querySelector('.error');
        const errorIcon = formGroup.querySelector('.error-icon');
        const successIcon = formGroup.querySelector('.success-icon');

        let formGroupError = false;
        for(const option of validationOptions){
            if(input.hasAttribute(option.attribute) && !option.isValid(input)){
                errorContainer.textContent = option.errorMessage(input, label);
                input.classList.add('border-red-700')
                input.classList.remove('border-green-700')
                successIcon.classList.add('hidden')
                errorIcon.classList.remove('hidden')
                formGroupError = true;
            }
        }

        if (!formGroupError){
            errorContainer.textContent = '';
            input.classList.add('border-green-700')
            input.classList.remove('border-red-700')
            successIcon.classList.remove('hidden')
            errorIcon.classList.add('hidden')
        }

        return !formGroupError;
    };

    formElement.setAttribute('novalidate', '');

    formElement.addEventListener('submit', event => {
        event.preventDefault();
        
    const formIsValid = validateAllFormGroups(formElement);

        if(formIsValid){
            console.log("Form is valid, sending")
            callback(formElement);
        } else {
            console.log("Form is invalid")
        };
    });

    const validateAllFormGroups = formToValidate => {
        const formGroups = Array.from(formToValidate.querySelectorAll('.form-group'));

        var formIsValid = true;
        formGroups.forEach(formGroup => {
            if (!validateSingleFormGroup(formGroup))
                formIsValid = false;
        });
        return formIsValid;
    }
};

const sendToApi = (formElement) => {
    const data = Array.from(formElement.elements)
        .filter(element => element.type !== 'submit')
        .reduce((accumulator, element) => ({...accumulator, [element.id]: element.value}), {});

        // data.desc = data.message

        // Send it to an API endpoint
        fetch("https://ibvpicae77.execute-api.us-east-1.amazonaws.com/contact-form", {
        method: "POST", // or PUT/PATCH depending on your API
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // Convert JS object → JSON string
        })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON response
        })
        .then(result => {
        console.log("API response:", result);
        })
        .catch(error => {
        console.error("Error sending data:", error);
        });
}

validateForm('#contactForm', sendToApi);