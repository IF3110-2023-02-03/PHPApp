const currentFullname = document.getElementById("current-fullname");
const currentUsername = document.getElementById("current-username");
const usage = document.getElementById("usage");

const usernameInput = document.getElementById("username");
const fullnameInput = document.getElementById("fullname");
const passwordInput = document.getElementById("password");
const passwordConfirmedInput = document.getElementById("confirm-password");

const usernameAlert = document.getElementById("username-alert");
const fullnameAlert = document.getElementById("fullname-alert");
const passwordAlert = document.getElementById("password-alert");

const usernameConfirmButton = document.getElementById("username-confirm");
const fullnameConfirmButton = document.getElementById("fullname-confirm");
const passwordConfirmButton = document.getElementById("password-confirm");

const fullnameRegex = /^[a-zA-Z ]+$/;
const usernameRegex = /^\w+$/;
const passwordRegex = /^\w+$/;

let usernameValid = false;
let fullnameValid = false;
let passwordValid = false;
let passwordConfirmedValid = false;

window.addEventListener(
    "load",
    debounce(() => {
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `/public/user/data?csrf_token=${CSRF_TOKEN}`
        );
        
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const data = JSON.parse(this.responseText);
                currentFullname.innerText = "Current Name: " + data['fullname'];
                currentUsername.innerText = "Current Username: " + data['username'];
                
                // show storage up to 2 decimal places
                usage.innerText = ((data['storage'] - data['storage_left']) / (1024 * 1024 * 1024)).toFixed(2) + "GB / " + (data['storage'] / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            }
        };
    }, DEBOUNCE_TIMEOUT)
);

usernameInput &&
    usernameInput.addEventListener(
        "keyup",
        debounce(() => {
            const username = usernameInput.value;

            const xhr = new XMLHttpRequest();
            xhr.open(
                "GET",
                `/public/user/username?username=${username}&csrf_token=${CSRF_TOKEN}`
            );

            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        usernameAlert.innerText = "Username already exists!";
                        usernameAlert.className = "alert-show";
                        usernameValid = false;
                    } else if (!usernameRegex.test(username)) {
                        usernameAlert.innerText = "Invalid username format!";
                        usernameAlert.className = "alert-show";
                        usernameValid = false;
                    } else {
                        usernameAlert.innerText = "";
                        usernameAlert.className = "alert-hide";
                        usernameValid = true;
                    }
                }
            };
        }, DEBOUNCE_TIMEOUT)
    );

usernameConfirmButton &&
    usernameConfirmButton.addEventListener("click", async (e) => {
        if (usernameValid) {
            const username = usernameInput.value;

            const formData = new FormData();
            formData.append("username", username);
            formData.append("csrf_token", CSRF_TOKEN);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updateUsername");

            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 201) {
                        window.location.reload();
                    }
                }
            };
        } else {
            e.preventDefault();
            usernameAlert.innerText = "Please fill out a valid username first!";
            usernameAlert.className = "alert-show";
        }
    });

fullnameInput &&
    fullnameInput.addEventListener(
        "keyup",
        debounce(() => {
            const fullname = fullnameInput.value;

            if (!fullnameRegex.test(fullname)) {
                fullnameAlert.innerText = "Invalid fullname format!";
                fullnameAlert.className = "alert-show";
                fullnameValid = false;
            } else {
                fullnameAlert.innerText = "";
                fullnameAlert.className = "alert-hide";
                fullnameValid = true;
            }
        }, DEBOUNCE_TIMEOUT)
    );

fullnameConfirmButton &&
    fullnameConfirmButton.addEventListener("click", async (e) => {
        if (fullnameValid) {
            const fullname = fullnameInput.value;

            const formData = new FormData();
            formData.append("fullname", fullname);
            formData.append("csrf_token", CSRF_TOKEN);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updateFullname");

            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 201) {
                        window.location.reload();
                    }
                }
            };
        } else {
            e.preventDefault();
            fullnameAlert.innerText = "Please fill out a valid fullname first!";
            fullnameAlert.className = "alert-show";
        }
    });

passwordInput &&
    passwordInput.addEventListener(
        "keyup",
        debounce(() => {
            const password = passwordInput.value;

            if (!passwordRegex.test(password)) {
                passwordAlert.innerText = "Invalid password format!";
                passwordAlert.className = "alert-show";
                passwordValid = false;
            } else {
                passwordAlert.innerText = "";
                passwordAlert.className = "alert-hide";
                passwordValid = true;
            }
        }, DEBOUNCE_TIMEOUT)
    );

passwordConfirmedInput &&
    passwordConfirmedInput.addEventListener(
        "keyup",
        debounce(() => {
            const password = passwordInput.value;
            const passwordConfirmed = passwordConfirmedInput.value;

            if (password !== passwordConfirmed) {
                passwordAlert.innerText =
                    "Confirmed password doesn't match!";
                passwordAlert.className = "alert-show";
                passwordConfirmedValid = false;
            } else {
                passwordAlert.innerText = "";
                passwordAlert.className = "alert-hide";
                passwordConfirmedValid = true;
            }
        }, DEBOUNCE_TIMEOUT)
    );

passwordConfirmButton &&
    passwordConfirmButton.addEventListener("click", async (e) => {
        if (passwordValid && passwordConfirmedValid) {
            const password = passwordInput.value;

            const formData = new FormData();
            formData.append("password", password);
            formData.append("csrf_token", CSRF_TOKEN);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updatePassword");

            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 201) {
                        window.location.reload();
                    }
                }
            };
        } else {
            e.preventDefault();
            passwordAlert.innerText =
                "Please fill out a valid password first!";
            passwordAlert.className = "alert-show";
        }
    });