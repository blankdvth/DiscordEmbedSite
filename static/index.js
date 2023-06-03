window.onbeforeunload = function (e) { // We reset the page on load, let's warn them.
    if (checkForChanges()) return "Are you sure you want to leave? Your changes WILL be lost.";
}

const colourPicker = document.getElementById("colour");
const hexColourPicker = document.getElementById("colour-hex");
const mediaSelect = document.getElementById("media-type");
const mediaInput = document.getElementById("media");
const mediaHelp = document.getElementById("media-help");
const mediaImageIcon = document.getElementById("image-outline-icon");
const mediaVideoIcon = document.getElementById("video-outline-icon");
const largeImageField = document.getElementById("large-image-field");

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
    colourPicker.value = changed.value;
    colourPicker.dataset.valid = changed.dataset.valid;
    hexColourPicker.value = changed.value;
    hexColourPicker.dataset.valid = changed.dataset.valid;
}

/**
 * Called to handle media inputs as appropriate based on the type of media.
 * @param element {HTMLInputElement | HTMLSelectElement}
 */
function handleMediaInput(element) {
    const mediaType = mediaSelect.value;
    if (element.nodeName === "SELECT") {
        if (mediaType === "Image") {
            largeImageField.classList.remove("is-hidden");
            mediaImageIcon.classList.remove("is-hidden");
            mediaVideoIcon.classList.add("is-hidden");
            mediaInput.placeholder = mediaInput.dataset.placeholderImage;
            mediaHelp.innerText = mediaHelp.dataset.image;
        } else if (mediaType === "Video") {
            largeImageField.classList.add("is-hidden");
            mediaImageIcon.classList.add("is-hidden");
            mediaVideoIcon.classList.remove("is-hidden");
            mediaInput.placeholder = mediaInput.dataset.placeholderVideo;
            mediaHelp.innerText = mediaHelp.dataset.video;
        }
    }
    if (mediaType === "Image") {
        handleInput(mediaInput, /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/i)
    } else if (mediaType === "Video") {
        handleInput(mediaInput, /^https?:\/\/.*\/.*\.(mp4|webm|mov)\??.*$/i)
    }
}

/**
 * Checks if values have changed from their default values
 */
function checkForChanges() {
    const elements = [...document.querySelectorAll("input, textarea, select")];
    return elements.some(element => {
        if (element.type === "checkbox") {
            return element.checked !== (element.dataset.default === "true");
        }
        return element.value !== (element.dataset.default ?? "");
    });
}

/**
 * Reset all form elements to their default values (data-default). Will be emptied if no data-default is set.
 */
function resetToDefault() {
    document.querySelectorAll("input, textarea, select").forEach(element => {
        if (element.type === "checkbox") {
            element.checked = element.dataset.default === "true";
            return;
        }
        element.value = element.dataset.default ?? "";
        // noinspection JSCheckFunctionSignatures - We have a custom oninput that takes an element as an argument.
        element.oninput?.(element);
    })
    document.getElementById("url-box").classList.add("is-hidden");
}

/**
 * Generates the output URL and displays it to the user.
 */
function generate() {
    const elements = [...document.querySelectorAll("input, textarea, select")];
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

resetToDefault(); // Clear all inputs on page load
