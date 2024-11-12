const usernameField = document.getElementById("field-username");
const usernameOutput = document.getElementById("field-username-output");
const form = document.getElementById("form");

// needed to validate on change event when no input was changed
let needsValidation = true;
let isValid = false;

function throttle(fn, wait) {
    let timeout;
    const throttleFn = function() {
        const args = Array.from(arguments);
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn.bind.apply(fn, [null].concat(args)), wait);
    };
    throttleFn.cancelQueued = function() {
        clearTimeout(timeout);
    };
    return throttleFn;
}

function checkUsernameAvailable(username) {
    let check_uri = 'check?username=' + encodeURIComponent(username);
    return fetch(check_uri, {
        // include the cookie
        "credentials": "same-origin",
    }).then(function(response) {
        if(!response.ok) {
            // for non-200 responses, raise the body of the response as an exception
            return response.text().then((text) => { throw new Error(text); });
        } else {
            return response.json();
        }
    }).then(function(json) {
        if(json.error) {
            return {message: json.error};
        } else if(json.available) {
            return {available: true};
        } else {
            return {message: username + " n'est pas disponible, veuillez choisir une autre."};
        }
    });
}

const allowedUsernameCharacters = new RegExp("^[a-z0-9\\.\\_\\-\\/\\=]+$");
const allowedCharactersString = "lettres minuscules, chiffres, ., _, -, /, =";

function reportError(error) {
    throttledCheckUsernameAvailable.cancelQueued();
    usernameOutput.innerText = error;
    usernameOutput.classList.add("error");
    usernameField.parentElement.classList.add("invalid");
    usernameField.focus();
}

function validateUsername(username) {
    isValid = false;
    needsValidation = false;
    usernameOutput.innerText = "";
    usernameField.parentElement.classList.remove("invalid");
    usernameOutput.classList.remove("error");
    if (!username) {
        return reportError("Ceci est requis. Veuillez fournir un nom d'utilisateur");
    }
    if (username.length > 255) {
        return reportError("Trop long, veuillez choisir quelque chose de plus court");
    }
    if (!allowedUsernameCharacters.test(username)) {
        return reportError("Nom d'utilisateur invalide, veuillez utiliser uniquement " + allowedCharactersString);
    }
    usernameOutput.innerText = "Vérification de la disponibilité du nom d'utilisateur …";
    throttledCheckUsernameAvailable(username);
}

const throttledCheckUsernameAvailable = throttle(function(username) {
    const handleError = function(err) {
        // don't prevent form submission on error
        usernameOutput.innerText = "";
        isValid = true;
    };
    try {
        checkUsernameAvailable(username).then(function(result) {
            if (!result.available) {
                reportError(result.message);
            } else {
                isValid = true;
                usernameOutput.innerText = "";
            }
        }, handleError);
    } catch (err) {
        handleError(err);
    }
}, 500);

form.addEventListener("submit", function(evt) {
    if (needsValidation) {
        validateUsername(usernameField.value);
        evt.preventDefault();
        return;
    }
    if (!isValid) {
        evt.preventDefault();
        usernameField.focus();
        return;
    }
});
usernameField.addEventListener("input", function(evt) {
    validateUsername(usernameField.value);
});
usernameField.addEventListener("change", function(evt) {
    if (needsValidation) {
        validateUsername(usernameField.value);
    }
});
