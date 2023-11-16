const container = document.getElementById('container');
const listPagination = document.getElementById('list-pagination')
const textbox = document.getElementById('fname')
let CURRENT_USERNAME;
const statePage = document.getElementById('state-page')
const leftButton = document.getElementById('left-page-button')
const rightButton = document.getElementById('right-page-button')

function openPopUp(object) {
    object.parentElement.parentElement.children[1].style.display = "flex";
}

function closePopUp(object) {
    object.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].style.display = "none";
}

function changeLike(object) {
    let object_id = object.parentElement.parentElement.parentElement.parentElement
                        .parentElement.parentElement.id;

    if (object.src == BASE_URL + "/assets/icons/heart.png") {
        const formData = new FormData();
        formData.append("object_id", object_id);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/public/like/store");

        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                object.src = BASE_URL + "/assets/icons/liked.png";
            }
        };
    } else {
        const formData = new FormData();
        formData.append("object_id", object_id);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/public/like/delete");

        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                object.src = BASE_URL + "/assets/icons/heart.png";
            }
        };
    }          
}

function isLiked(element) {
    let object_id = element['object_id'];
    let object = document.getElementById('likestat' + element['object_id']);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/public/like/isLiked?object_id=" + object_id);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            console.log(responseObj);
            if (responseObj['like']) {
                object.src = BASE_URL + "/assets/icons/liked.png";
            } else {
                object.src = BASE_URL + "/assets/icons/heart.png";
            }
        }
    };                    
}

function getUsername(element) {
    let object = document.getElementById('uname' + element['object_id']);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/public/user/getUsername?user_id=" + element['user_id']);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            console.log(this.responseText);
            object.innerText = responseObj["username"]["username"];
        }
    };                    
}

function getCurrentUsername() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/public/user/getCurrentUsername");

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            CURRENT_USERNAME = responseObj["username"]["username"];
        }
    };                  
}

function makeUserComment(content, username) {
    const commentItemDiv = document.createElement("div");
    commentItemDiv.classList.add("comment-item");

    const commentContainerDiv = document.createElement("div");
    commentContainerDiv.classList.add("comment-container");

    const commentSenderP = document.createElement("p");
    commentSenderP.classList.add("comment-sender");
    commentSenderP.textContent = username;

    const commentContentP = document.createElement("p");
    commentContentP.classList.add("comment-content");
    commentContentP.textContent = content;

    commentContainerDiv.appendChild(commentSenderP);
    commentContainerDiv.appendChild(commentContentP);

    commentItemDiv.appendChild(commentContainerDiv);
    return commentItemDiv;
}

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
                let item;
                if (comment['user_id'] == responseObj["user_id"]) {
                    item = makeAdminComment(comment['message'], comment['username'], comment["comment_id"]);
                } else {
                    item = makeUserComment(comment['message'], comment['username']);
                }
                
                let container = document.getElementById('comments' + object_id);
                container.appendChild(item);
            });
        }
    };
}

function addComment(object) {
    let object_id = object.parentElement.parentElement.parentElement.parentElement
                        .parentElement.parentElement.id;
    let textfield = document.getElementById('tf-comment' + object_id);

    const formData = new FormData();
    formData.append("object_id", object_id);
    formData.append("message", textfield.value);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/public/comment/store");

    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            let comment = makeAdminComment(textfield.value, CURRENT_USERNAME);
            let container = document.getElementById('comments' + object_id);
            container.appendChild(comment);
            textfield.value = '';
        }
    };
}

function makeFeed(element) {
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
                            <h2 class="photo-popup-name">${element['description'] == 'null' ? "No Description" : element['description']}</h2>
                        </div>
                        <br>
                        <div class="photo-popup-info-property">
                            <img src="${BASE_URL}/assets/icons/profile.png" class="photo-popup-property-icon"/>
                            <p class="photo-popup-property-desc" id="uname${element['object_id']}"></p>
                        </div>
                        <div class="photo-popup-info-property">
                            <img src="${BASE_URL}/assets/icons/heart.png" class="photo-popup-property-icon" onclick="changeLike(this)" id="likestat${element['object_id']}"/>
                            <p class="photo-popup-property-desc">Like</p>
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
                    <div>
                        <div class="form">
                            <input type="text" id="tf-comment${element['object_id']}" class="textfield2" placeholder="Write a comment"><br>    
                            <input type="submit" onclick="addComment(this)" value="Send" class="button-black">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    photoCard.innerHTML = photoCardHTML;

    return photoCard;
}

function refresh(perpage, page, filter) {
    container.innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getPublic?perpage=${perpage}&page=${page}&filter=${filter}`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            var objectArray = responseObj.object;
            objectArray.forEach(element => {
                container.appendChild(
                    makeFeed(element)
                )
                isLiked(element);
                getUsername(element);
                loadComment(element);
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

function setupLength(filter, current){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getLengthPublic?filter=${filter}`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            var len = responseObj.object.len;
            statePage.value = current
            displayPagination(len,current)
        }
    };
}

textbox &&
    textbox.addEventListener(
        "keyup",
        debounce(() => {
            refresh(12, 1, textbox.value)
            setupLength(textbox.value, 1)
        }, DEBOUNCE_TIMEOUT)
    );

function displayPagination(len, current){
    listPagination.innerHTML = '';
    if(current == 1){
        leftButton.style.display = "none"
    }else{
        leftButton.style.display = "block"
    }
    if(current == Math.ceil(len/12)){
        rightButton.style.display = "none"
    }else{
        rightButton.style.display = "block"
    }
    for(let i=0;i<=len;i+=12){
        if(i>current-3 || i<current+3){
            const p = document.createElement('p')
            p.innerHTML = (i+12)/12
            p.className = 'page-item'
            if((i+12)/12 == current){
                p.style.fontSize = '38px'
                p.style.fontWeight = 'bold'
            }
            p.onclick = () => {
                refresh(12, (i+12)/12, textbox.value)
                statePage.value =(i+12)/12
                displayPagination(len,(i+12)/12)
            }
            listPagination.appendChild(p)
        }
    }
}

// leftButton.addEventListener('click', () => {
//     refresh(12, statePage.value-1, textbox.value)
//     setupLength(textbox.value, statePage.value-1)
// })

// rightButton.addEventListener('click', () => {
//     refresh(12, statePage.value+1, textbox.value)
//     setupLength(textbox.value, statePage.value+1)
// })


window.addEventListener(
    "load",
    debounce(() => {
        refresh(12,1,"")
        setupLength("",1)
        getCurrentUsername();
    }, DEBOUNCE_TIMEOUT)
);