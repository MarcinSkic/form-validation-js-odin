import countries from "./countries.js";
let validated = false;

class ValidableInput {
    input: HTMLInputElement;
    validations: ((input: HTMLInputElement) => boolean | String)[];
    associatedInputs: ValidableInput[] = [];

    constructor(
        input: HTMLInputElement,
        ...validations: ((input: HTMLInputElement) => boolean | String)[]
    ) {
        this.input = input;
        this.validations = validations;

        input.addEventListener("input", () => {
            if (input.validationMessage === "") return;
            this.validate();
        });
    }

    validate() {
        for (const validation of this.validations) {
            const validationResult = validation(this.input);

            if (validationResult !== true) {
                this.input.setCustomValidity(String(validationResult));
                this.input.reportValidity();
                return false;
            }
        }
        this.input.setCustomValidity("");

        for (const input of this.associatedInputs) {
            if (input.input.validationMessage !== "") {
                console.log(input);
                input.validate();
            }
        }

        return true;
    }
}

function validateNotEmpty(input: HTMLInputElement) {
    return input.value !== "" || "Field should not be empty";
}

function validateIsEmail(input: HTMLInputElement) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return (
        emailRegex.test(input.value ?? "") ||
        `Email '${input.value}' is incorrect, should be (name@domain.domain)`
    );
}

function validateIsCountry(input: HTMLInputElement) {
    return (
        countries.has(input.value ?? "") || `${input.value} is not a country`
    );
}

function validateIsZipcode(input: HTMLInputElement) {
    const zipcodeRegex = /^[0-9]{2}-[0-9]{3}$/;
    return (
        zipcodeRegex.test(input.value ?? "") ||
        `Zipcode '${input.value}' is incorrect, should be (00-000)`
    );
}

function validateEqualsInput(this: ValidableInput, input: HTMLInputElement) {
    return this.input.value === input.value || `Passwords don't match`;
}

const form = document.querySelector("form")!;

const emailInput = new ValidableInput(
    form.querySelector("input[name = 'email']")!,
    validateNotEmpty,
    validateIsEmail
);

const countryInput = new ValidableInput(
    form.querySelector("input#country")!,
    validateNotEmpty,
    validateIsCountry
);
const zipcodeInput = new ValidableInput(
    form.querySelector("input#zipcode")!,
    validateNotEmpty,
    validateIsZipcode
);
const passwordInput = new ValidableInput(
    form.querySelector("input#password")!,
    validateNotEmpty
);
const passwordConfirmInput = new ValidableInput(
    form.querySelector("input#password-confirm")!,
    validateNotEmpty
);

passwordInput.validations.push(validateEqualsInput.bind(passwordConfirmInput));
passwordInput.associatedInputs.push(passwordConfirmInput);
passwordConfirmInput.validations.push(validateEqualsInput.bind(passwordInput));
passwordConfirmInput.associatedInputs.push(passwordInput);

form.addEventListener("submit", (ev: SubmitEvent) => {
    let succeded = true;

    const inputs = [
        emailInput,
        countryInput,
        zipcodeInput,
        passwordInput,
        passwordConfirmInput,
    ];

    inputs.forEach((input) => {
        if (!input.validate()) {
            succeded = false;
        }
    });

    if (succeded) {
        console.log("Validation succeded");
    }

    ev.preventDefault();
});
