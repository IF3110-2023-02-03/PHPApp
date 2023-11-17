const currentUser = document.querySelector("#current-user");
const currentFullname = document.querySelector("#current-fullname");
const currentUsername = document.querySelector("#current-username");
const usage = document.querySelector("#usage");

const usernameInput = document.querySelector("#username");
const fullnameInput = document.querySelector("#fullname");
const passwordInput = document.querySelector("#password");
const passwordConfirmedInput = document.querySelector("#confirm-password");
const storageInput = document.querySelector("#storage");

const usernameAlert = document.querySelector("#username-alert");
const fullnameAlert = document.querySelector("#fullname-alert");
const passwordAlert = document.querySelector("#password-alert");
const storageAlert = document.querySelector("#storage-alert");

const usernameConfirmButton = document.querySelector("#username-confirm");
const fullnameConfirmButton = document.querySelector("#fullname-confirm");
const passwordConfirmButton = document.querySelector("#password-confirm");
const storageConfirmButton = document.querySelector("#storage-confirm");
const deleteButton = document.querySelector("#delete-button");

const fullnameRegex = /^[a-zA-Z ]+$/;
const usernameRegex = /^\w+$/;
const passwordRegex = /^\w+$/;
const storageRegex = /^\d+$/;

let usernameValid = false;
let fullnameValid = false;
let passwordValid = false;
let passwordConfirmedValid = false;
let storageValid = false;

let storageUsed = 0;

window.addEventListener(
    "load",
    debounce(() => {
        const xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `/public/user/dataByUsername?username=${USERNAME}&csrf_token=${CSRF_TOKEN}`
        );
        
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const data = JSON.parse(this.responseText);
                currentUser.innerText = "User @" + data['username'];
                currentFullname.innerText = "Current Name: " + data['fullname'];
                currentUsername.innerText = "Current Username: " + data['username'];
                
                // show storage up to 2 decimal places
                usage.innerText = ((data['storage'] - data['storage_left']) / (1024 * 1024 * 1024)).toFixed(2) + "GB / " + (data['storage'] / (1024 * 1024 * 1024)).toFixed(2) + "GB";

                storageUsed = data['storage'] - data['storage_left'];
            }
        };
    }, DEBOUNCE_TIMEOUT)
);

deleteButton &&
    deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();

        // Get all of user object
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `/public/user/getAllUserOwnedObjects?username=${USERNAME}&csrf_token=${CSRF_TOKEN}`
        );

        xhr.send();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const data = JSON.parse(this.responseText);

                // Delete all of user objects
                data.forEach((object) => {
                    let formData = new FormData();
                    formData.append("username", USERNAME);
                    formData.append("object_id", object['object_id']);
                    formData.append("url_video", object['url_video']);
                    formData.append("url_photo", object['url_photo']);
                    formData.append("csrf_token", CSRF_TOKEN);

                    xhr = new XMLHttpRequest();
                    xhr.open("POST", `/public/object/deleteByUsername`);

                    xhr.send(formData);
                });
                
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        xhr = new XMLHttpRequest();
                        xhr.open("POST", `/public/user/delete`);

                        formData = new FormData();
                        formData.append("username", USERNAME);
                        formData.append("csrf_token", CSRF_TOKEN);
                        xhr.send(formData);

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                window.location.href = "/public/admin/users";
                            }
                        }
                    }
                }
            }
        };
    });

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
            formData.append("username", USERNAME);
            formData.append("new_username", username);
            formData.append("csrf_token", CSRF_TOKEN);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updateUsernameByUsername");

            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 201) {
                        // update username in Rest Database
                        xhr = new XMLHttpRequest();
                        xhr.open("PUT", "http://localhost:3000/api/follower");
                        xhr.setRequestHeader("Content-Type", "application/json");

                        xhr.send(JSON.stringify({oldUsername: USERNAME, newUsername: username}));
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (this.status === 200) {
                                    // update username in SOAP Database
                                    xhr = new XMLHttpRequest();
                                    xhr.open("POST", "http://localhost:8000/api/following");
                                    xhr.setRequestHeader("Content-Type", "text/xml");

                                    xhr.send(`
                                        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                            <Body>
                                                <updateFollowerUsername xmlns="http://services.example.org/">
                                                    <arg0 xmlns="">${USERNAME}</arg0>
                                                    <arg1 xmlns="">${username}</arg1>
                                                    <arg2 xmlns="">ini_api_key_monolitik</arg2>
                                                </updateFollowerUsername>
                                            </Body>
                                        </Envelope>
                                    `)
                                    xhr.onreadystatechange = function () {
                                        if (xhr.readyState === XMLHttpRequest.DONE) {
                                            window.location.href = "/public/admin/user/" + username;
                                        }
                                    }
                                }
                            }
                        }
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
            const fullnameParts = currentFullname.innerText.split(": ");
            const oldFullname = fullnameParts.length > 1 ? fullnameParts[1] : null;
            const fullname = fullnameInput.value;

            const formData = new FormData();
            formData.append("username", USERNAME);
            formData.append("fullname", fullname);
            formData.append("csrf_token", CSRF_TOKEN);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updateFullnameByUsername");

            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 201) {
                        // update fullname in SOAP Database
                        xhr = new XMLHttpRequest();
                        xhr.open("POST", "http://localhost:8000/api/following");
                        xhr.setRequestHeader("Content-Type", "text/xml");

                        xhr.send(`
                            <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                                <Body>
                                    <updateFollowerName xmlns="http://services.example.org/">
                                        <arg0 xmlns="">${oldFullname}</arg0>
                                        <arg1 xmlns="">${fullname}</arg1>
                                        <arg2 xmlns="">ini_api_key_monolitik</arg2>
                                    </updateFollowerName>
                                </Body>
                            </Envelope>
                        `)
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                window.location.reload();
                            }
                        }
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
            formData.append("username", USERNAME);
            formData.append("password", password);
            formData.append("csrf_token", CSRF_TOKEN);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updatePasswordByUsername");

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

storageInput &&
    storageInput.addEventListener(
        "keyup",
        debounce(() => {
            const storage = storageInput.value;

            if (!storageRegex.test(storage)) {
                storageAlert.innerText = "Invalid storage format!";
                storageAlert.className = "alert-show";
                storageValid = false;
            } else if ((storage*1024*1024*1024) < storageUsed) {
                storageAlert.innerText = "Storage must be greater than current usage!";
                storageAlert.className = "alert-show";
                storageValid = false;
            } else {
                storageAlert.innerText = "";
                storageAlert.className = "alert-hide";
                storageValid = true;
            }
        }, DEBOUNCE_TIMEOUT)
    );

storageConfirmButton &&
    storageConfirmButton.addEventListener("click", async (e) => {
        if (storageValid) {
            const storage = storageInput.value;

            const formData = new FormData();
            formData.append("username", USERNAME);
            formData.append("storage", storage*1024*1024*1024);
            formData.append("csrf_token", CSRF_TOKEN);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/public/user/updateStorageByUsername");

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
            storageAlert.innerText =
                "Please fill out a valid storage first!";
            storageAlert.className = "alert-show";
        }
    });