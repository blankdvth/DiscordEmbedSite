/**
 * Called upon user input in input element, used to handle validation.
 * If an element with an ID of `elementId-help` exists, it will be shown/hidden based on the validity of the input.
 * @param element {HTMLInputElement|HTMLTextAreaElement} The input element that was changed.
 * @param regex {RegExp | null} The regex to test the input against, if null, the default validity check will be used.
 * @returns {boolean} Whether the input is valid.
 */
function handleInput(element, regex= null) {
    if (element.id.length === 0) {
        console.error("Element ID is empty, cannot remove error message.");
        return false;
    }

    const helpElement = document.getElementById(`${element.id}-help`);
    const value = element.type === "checkbox" ? element.checked : element.value;
    if (regex !== null ? !element.required && !value || regex.test(value) : element.validity.valid) {
        element.dataset.valid = "true";
        element.classList.remove("is-danger");
        helpElement?.classList.add("is-hidden");
        return true;
    } else {
        delete element.dataset.valid;
        element.classList.add("is-danger");
        helpElement?.classList.remove("is-hidden");
        return false;
    }
}

/**
 * Called to handle make sure the colour inputs are equal.
 * @param changed {HTMLInputElement} The input element that was changed.
 */
function handleColourInput(changed) {
    const picker = document.getElementById("colour");
    const hex = document.getElementById("colour-hex");
    picker.value = changed.value;
    picker.dataset.valid = changed.dataset.valid;
    hex.value = changed.value;
    hex.dataset.valid = changed.dataset.valid;
}

/**
 * Reset all form elements to their default values (data-default). Will be emptied if no data-default is set.
 */
function resetToDefault() {
    document.querySelectorAll("input, textarea").forEach(element => {
        if (element.type === "checkbox") {
            element.checked = element.dataset.default === "true";
            return;
        }
        element.value = element.dataset.default ?? "";
    })
    document.getElementById("url-box").classList.add("is-hidden");
}

/**
 * Generates the output URL and displays it to the user.
 */
function generate() {
    const elements = [...document.querySelectorAll("input, textarea")];
    if (!elements.every(element => handleInput(element))) return;
    // Generate JSON consisting of pairs of ID:value
    const data = {};
    elements.forEach(element => {
        if (!element.value) return;
        data[element.id.replaceAll("-", "_")] = element.type === "checkbox" ? element.checked : element.value;
    });

    document.getElementById("generated-url").innerText = `${window.location.origin}/${LZString.compressToEncodedURIComponent(JSON.stringify(data))}`;
    document.getElementById("url-box").classList.remove("is-hidden");
}

function copyURL() {
    const copyConfirmation = document.getElementById("copy-confirmation");
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(document.getElementById("generated-url").innerText).then(() => {
            unfade(copyConfirmation);
            setTimeout(() => {
                fade(copyConfirmation);
            }, 2000);
        });
    } else {
        // Use fallback
        const textarea = document.createElement("textarea");
        textarea.value = document.getElementById("generated-url").innerText;
        textarea.style.position = "absolute";
        textarea.style.left = "-999999px";
        document.body.prepend(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
        } catch (error) {
            return;
        } finally {
            textarea.remove();
        }

        unfade(copyConfirmation);
        setTimeout(() => {
            fade(copyConfirmation);
        }, 2000);
    }
}

function fade(element) {
    let op = 1;  // initial opacity
    const timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.classList.add("is-hidden");
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 0.05);
}

function unfade(element) {
    element.style.opacity = "0";
    element.classList.remove("is-hidden");
    let op = 0.1;  // initial opacity
    element.style.display = 'block';
    const timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 0.05);
}
