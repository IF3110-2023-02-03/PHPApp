const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginForm = document.querySelector(".login-form");
const usernameAlert = document.querySelector("#username-alert");
const passwordAlert = document.querySelector("#password-alert");

const usernameRegex = /^\w+$/;
const passwordRegex = /^\w+$/;

let usernameValid = false;
let passwordValid = false;

usernameInput &&
    usernameInput.addEventListener(
        "keyup",
        debounce(() => {
            const username = usernameInput.value;

            if (!usernameRegex.test(username)) {
                usernameAlert.innerText = "Invalid username format!";
                usernameAlert.className = "alert-show";
                usernameValid = false;
            } else {
                usernameAlert.innerText = "";
                usernameAlert.className = "alert-hide";
                usernameValid = true;
            }
        }, DEBOUNCE_TIMEOUT)
    );

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
        })
    );

loginForm &&
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username) {
            usernameAlert.innerText = "Please fill out your username first!";
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

        if (!password) {
            passwordAlert.innerText = "Please fill out your password first!";
            passwordAlert.className = "alert-show";
            passwordValid = false;
        } else if (!passwordRegex.test(password)) {
            passwordAlert.innerText = "Invalid password format!";
            passwordAlert.className = "alert-show";
            passwordValid = false;
        } else {
            passwordAlert.innerText = "";
            passwordAlert.className = "alert-hide";
            passwordValid = true;
        }

        if (!usernameValid || !passwordValid) {
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("csrf_token", CSRF_TOKEN);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/public/user/login");

        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 201) {
                    document.querySelector("#login-alert").className =
                        "alert-hide";
                    const data1 = JSON.parse(this.responseText);
                    const xhr2 = new XMLHttpRequest();
                    xhr2.open(
                        "GET",
                        `/public/user/data?csrf_token=${CSRF_TOKEN}`
                    );
                    console.log(data1)
                    xhr2.send();
                    xhr2.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            const data = JSON.parse(this.responseText);
                            localStorage.setItem("fullname", data['fullname'])
                            localStorage.setItem("username", data["username"])
                            localStorage.setItem("id", data["user_id"])
                            location.replace(data1.redirect_url);
                        }
                    };
                } else {
                    document.querySelector("#login-alert").className =
                        "alert-show";
                }
            }
        };
    });
