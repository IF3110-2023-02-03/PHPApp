const fullname = document.getElementById("name");
const username = document.getElementById("username");
const logOutButton = document.querySelector("#log-out");
const container = document.getElementById('container');
const listPagination = document.getElementById('list-pagination')
const statePage = document.getElementById('state-page')
const leftButton = document.getElementById('left-page-button')
const rightButton = document.getElementById('right-page-button')


function openPopUp(object) {
    object.parentElement.parentElement.children[1].style.display = "flex";
}

function closePopUp(object) {
    object.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].style.display = "none";
}

function changeStatus(object) {
    let object_id = object.parentElement.parentElement.parentElement.parentElement.id;

    const formData = new FormData();
    formData.append("object_id", object_id);
    formData.append("isPublic", 1);
    formData.append("csrf_token", CSRF_TOKEN);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/public/object/updateIsPublic");

    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            object.parentElement.parentElement.parentElement.style.display = "none";
            refresh(12,1)
            setupLength(1)
        }
    };
}

function openChangeDesc(object) {
        object.parentElement.children[2].style.display = "flex";
}

function closeChangeDesc(object) {
    object.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
}

function changeDesc(object) {
    let object_id = object.parentElement.parentElement.parentElement.parentElement
                          .parentElement.parentElement.parentElement.parentElement
                          .parentElement.parentElement.parentElement.id

    let textfield = document.getElementById('desc' + object_id);
    let text = textfield.value;

    const formData = new FormData();
    formData.append("object_id", object_id);
    formData.append("text", text);
    formData.append("csrf_token", CSRF_TOKEN);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/public/object/updateDesc");

    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            closeChangeDesc(object)
            let desc = document.getElementById('title' + object_id);
            desc.innerText = text;
        }
    };
}

function countLike(object_id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/public/like/count?object_id=" + object_id);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            let like = document.getElementById('like' + object_id)
            like.innerText = responseObj['like']['count'] == undefined ? 0 : responseObj['like']['count'] + ' Likes';
        }
    };
}


function makePost(element) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.id = element['object_id'];

    const photoCardHTML = `
        <div class="photo-thumbnail-container">
            ${element['type'] === 'Photo'
                ? ` <img src="${STORAGE_URL + '/' + (element['type'] == 'Photo' ? 'images' : 'videos') + '/' + element['url_photo']}" class="photo-thumbnail" onclick="openPopUp(this)" id="img${element['url_photo']}"/>`
                : ` <img class="photo-thumbnail" onclick="openPopUp(this)" id="img${element['url_photo']}"/>`
            }
        </div>
        <div class="photo-popup-container">
            <div class="photo-popup">
                <div class="photo-popup-img-container" id="${element['type'] == 'Photo' ? 'images' + element['url_photo'] : 'videos' + element['url_video']}">
                    ${element['type'] === 'Photo'
                        ? `<img src="${STORAGE_URL + '/' + (element['type'] == 'Photo' ? 'images' : 'videos') + '/' + element['url_photo']}" class="photo-popup-img" alt="Photo">`
                        : `<video controls="controls" class="photo-popup-img" id="video${element['object_id']}" src="${STORAGE_URL + '/' + (element['type'] == 'Photo' ? 'images' : 'videos') + '/' + element['url_video']}#t=0.1" type="video/mp4" preload="metadata">
                            </video>`
                    }
                </div>
                <div class="photo-popup-info-container">
                    <div class="photo-popup-close">
                        <img src="${BASE_URL}/assets/icons/close.png" onclick="closePopUp(this)" />
                    </div>
                    <br>
                    <div class="scrollable">
                        <div class="photo-popup-name-container">
                            <h2 class="photo-popup-name" id="title${element['object_id']}">${element['description']}</h2>
                            <img src="${BASE_URL}/assets/icons/edit.png" class="photo-popup-property-icon" onclick="openChangeDesc(this)"/>
                            <div class="popup-container">
                                <div class="popup">
                                    <div class="popup-info-container">
                                        <div class="photo-popup-close">
                                            <img src="${BASE_URL}/assets/icons/close.png" class="photo-popup-close" onclick="closeChangeDesc(this)" />
                                        </div>
                                        <div class="registration-form">
                                            <div class="form-group">
                                                <input type="text" id="desc${element['object_id']}" class="textfield" placeholder="New Desciption">
                                            </div>
                                            <div class="form-button">
                                                <button class="button-black" onclick="changeDesc(this)">Change Description</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="photo-popup-info-property">
                            <img src="${BASE_URL}/assets/icons/heart.png" class="photo-popup-property-icon"/>
                            <p class="photo-popup-property-desc" id="like${element['object_id']}"></p>
                        </div>
                        <div class="photo-popup-info-property">
                            <img src="${BASE_URL}/assets/icons/date.png" class="photo-popup-property-icon"/>
                            <p class="photo-popup-property-desc">${element['post_date']}</p>
                        </div>
                        <br>
                        <h1 class="visibility-status">Comments</h1>
                        <div class="comments-container" id="comments${element['object_id']}">
                        </div>
                    </div>
                    <button class="button-white" onclick="changeStatus(this)">Hide this photo from my profile</button>
                </div>
            </div>
        </div>
    `;

    photoCard.innerHTML = photoCardHTML;

    return photoCard;
}

function refresh(perpage, page) {
    console.log('Hello');
    container.innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getPrivate?perpage=${perpage}&page=${page}`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            console.log(this.responseText);
            var objectArray = responseObj.object;
            objectArray.forEach(element => {
                container.appendChild(
                    makePost(element)
                )
                countLike(element['object_id']);
                loadComment(element)
                if (element['type'] == 'Video') {
                    const video = document.getElementById('video' + element['object_id'])
                    video.onloadedmetadata = function() {
                        let secs = 0.1;
                        if ('function' === typeof secs) {
                            secs = secs(this.duration);
                        }
                        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
                    };
                    
                    video.onseeked = function(e) {
                        var canvas = document.createElement('canvas');
                        canvas.height = video.videoHeight;
                        canvas.width = video.videoWidth;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        document.getElementById(element['object_id']).children[0].children[0].src = canvas.toDataURL();
                    };
                };
            });
            
        }
    };
}

let len;

function setupLength(current){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getLengthPrivate`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            len = responseObj.object.len;
            statePage.value = current
            displayPagination(len,current)
        }
    };
}

function displayPagination(len, current){
    listPagination.innerHTML = '';
    const maxButtonsToShow = 10;

    let startPage = Math.max(1, current - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(Math.ceil(len / 12), startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const p = document.createElement('p');
        p.innerHTML = i;
        p.className = 'page-item';

        // Add cursor:pointer style when hovering over the pagination numbers
        p.style.cursor = 'pointer';

        if (i === current) {
            p.style.fontSize = '38px';
            p.style.fontWeight = 'bold';
        }

        p.onclick = () => {
            const clickedPage = i;
            refresh(12, clickedPage);
            statePage.value = clickedPage;
            displayPagination(len, clickedPage);
        };

        listPagination.appendChild(p);
    }

    leftButton.onclick = () => {
        const prevPage = Math.max(1, current - 1);
        refresh(12, prevPage);
        setupLength(prevPage)
        statePage.value = prevPage;
        displayPagination(len, prevPage);
    };

    rightButton.onclick = () => {
        const nextPage = Math.min(Math.ceil(len / 12), current + 1);
        refresh(12, nextPage);
        setupLength(nextPage)
        statePage.value = nextPage;
        displayPagination(len, nextPage);
    };
}

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
                fullname.innerText = data['fullname'];
                username.innerText = "@" + data['username'];
                refresh(12, 1)
                setupLength(1)
            }
        };
    }, DEBOUNCE_TIMEOUT)
);

logOutButton &&
    logOutButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const xhr = new XMLHttpRequest();

        xhr.open("POST", `/public/user/logout`);

        const formData = new FormData();
        formData.append("csrf_token", CSRF_TOKEN);
        xhr.send(formData);

        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                const data = JSON.parse(this.responseText);
                location.replace(data.redirect_url);
            }
        };
    });


function makeAdminComment(content, username, id) {
    const commentItemDiv = document.createElement("div");
    commentItemDiv.classList.add("comment-item");
    commentItemDiv.id = 'comment' + id;

    const commentContainerDiv = document.createElement("div");
    commentContainerDiv.classList.add("comment-container");

    const commentSenderP = document.createElement("p");
    commentSenderP.classList.add("comment-sender");
    commentSenderP.textContent = username;

    const commentContentP = document.createElement("p");
    commentContentP.classList.add("comment-content");
    commentContentP.textContent = content;

    const trashIconImg = document.createElement("img");
    trashIconImg.src = BASE_URL + "/assets/icons/trash.png";
    trashIconImg.classList.add("photo-popup-property-icon");
    trashIconImg.addEventListener('click', function() {
        const formData = new FormData();
        console.log(commentItemDiv.id.slice(7));
        formData.append("comment_id", Number(commentItemDiv.id.slice(7)));

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/public/comment/delete");

        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                commentItemDiv.remove();
            }
        };
    });

    commentContainerDiv.appendChild(commentSenderP);
    commentContainerDiv.appendChild(commentContentP);

    commentItemDiv.appendChild(commentContainerDiv);
    commentItemDiv.appendChild(trashIconImg);
    return commentItemDiv;
}

function loadComment(element) {
    let object_id = element['object_id'];

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/public/comment/getByIdObject?object_id=" + object_id);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            var commentdata = responseObj['comments'];
            commentdata.forEach(comment => {
                let item = makeAdminComment(comment['message'], comment['username'], comment["comment_id"]);
                let container = document.getElementById('comments' + object_id);
                container.appendChild(item);
            });
        }
    };
}