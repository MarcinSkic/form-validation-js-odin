import countries from "./countries.js";
let validated = false;
class ValidableInput {
    constructor(input, ...validations) {
        this.input = input;
        this.validations = validations;
        input.addEventListener("input", () => {
            if (input.validationMessage === "")
                return;
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
        return true;
    }
}
function validateNotEmpty(input) {
    return input.value !== "" || "Field should not be empty";
}
function validateIsEmail(input) {
    var _a;
    const emailRegex = /^\S+@\S+\.\S+$/;
    return (emailRegex.test((_a = input.value) !== null && _a !== void 0 ? _a : "") ||
        `Email '${input.value}' is incorrect, should be (name@domain.domain)`);
}
function validateIsCountry(input) {
    var _a;
    return (countries.has((_a = input.value) !== null && _a !== void 0 ? _a : "") || `${input.value} is not a country`);
}
function validateIsZipcode(input) {
    var _a;
    const zipcodeRegex = /^[0-9]{2}-[0-9]{3}$/;
    return (zipcodeRegex.test((_a = input.value) !== null && _a !== void 0 ? _a : "") ||
        `Zipcode '${input.value}' is incorrect, should be (00-000)`);
}
function validateEqualsInput(input) {
    return this.value === input.value || `Passwords don't match`;
}
const form = document.querySelector("form");
const emailInput = new ValidableInput(form.querySelector("input[name = 'email']"), validateNotEmpty, validateIsEmail);
const countryInput = new ValidableInput(form.querySelector("input#country"), validateNotEmpty, validateIsCountry);
const zipcodeInput = new ValidableInput(form.querySelector("input#zipcode"), validateNotEmpty, validateIsZipcode);
const passwordInput = new ValidableInput(form.querySelector("input#password"), validateNotEmpty, validateEqualsInput.bind(form.querySelector("input#password-confirm")));
const passwordConfirmInput = new ValidableInput(form.querySelector("input#password-confirm"), validateNotEmpty, validateEqualsInput.bind(form.querySelector("input#password")));
form.addEventListener("submit", (ev) => {
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
