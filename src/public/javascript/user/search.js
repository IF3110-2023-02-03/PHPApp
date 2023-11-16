const container = document.getElementById('container')
const listPagination = document.getElementById('list-pagination')
const textbox = document.getElementById('fname')
const sortName = document.getElementById('sortName')
const filter = document.getElementById('filter')
const statePage = document.getElementById('state-page')
const leftButton = document.getElementById('left-page-button')
const rightButton = document.getElementById('right-page-button')

function openPopUp(object) {
    object.parentElement.parentElement.children[1].style.display = "flex";
}

function closePopUp(object) {
    object.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].style.display = "none";
}

function changeStatus(object) {
    let isPublic = undefined;
    if (object.innerText == "Show in My Profile") {
        isPublic = 0;
    } else {
        isPublic = 1;
    }

    let object_id = object.parentElement.parentElement.parentElement.parentElement.parentElement.id;

    console.log(object_id, isPublic)
    const formData = new FormData();
    formData.append("object_id", object_id);
    formData.append("isPublic", isPublic);
    formData.append("csrf_token", CSRF_TOKEN);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/public/object/updateIsPublic");

    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            let stat = object.parentElement.children[7];
            console.log("done");
            if (object.innerText == "Show in My Profile") {
                object.innerText = "Hide from My Profile";
                stat.innerText = "Others can see this photo";
            } else {
                object.innerText = "Show in My Profile";
                stat.innerText = "Others can't see this photo";
            }
        }
    };
}

function deletePhoto(object) {
    let object_id = object.parentElement.parentElement.parentElement.parentElement.id;
    let url_photo = object.parentElement.parentElement.parentElement.parentElement.children[0].children[0].id.slice(3);
    let url_video = object.parentElement.parentElement.parentElement.parentElement.children[1].children[0].children[0].id.slice(6);

    console.log(object.parentElement.parentElement.parentElement.parentElement.children[0]);

    const formData = new FormData();
    console.log(url_photo, url_video)
    formData.append("object_id", object_id);
    formData.append("url_video", url_video);
    formData.append("url_photo", url_photo);
    formData.append("csrf_token", CSRF_TOKEN);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/public/object/delete");

    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            object.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].style.display = "none";
            refresh(12,1);
            setupLength(1)
        }
    };
}

function openChangeName(object) {
    object.parentElement.children[2].style.display = "flex";
}

function closeChangeName(object) {
    object.parentElement.parentElement.parentElement.parentElement.style.display = "none";
}

function changeName(object) {
    let object_id = object.parentElement.parentElement.parentElement
                        .parentElement.parentElement.parentElement.parentElement
                        .parentElement.parentElement.parentElement.id

    let textfield = document.getElementById('name' + object_id);
    let text = textfield.value;

    const formData = new FormData();
    formData.append("object_id", object_id);
    formData.append("text", text);
    formData.append("csrf_token", CSRF_TOKEN);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/public/object/updateName");

    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            closeChangeName(object)
            let name = document.getElementById('title' + object_id);
            name.innerText = text;
        }
    };
}

function makePhoto(element) {
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
                    <div class="photo-popup-info">
                        <div class="photo-popup-close">
                            <img src="${BASE_URL}/assets/icons/close.png" onclick="closePopUp(this)" />
                        </div>
                        <br>
                        <div class="photo-popup-name-container">
                            <h1 class="photo-popup-name" id="title${element['object_id']}">${element['title']}</h1>
                            <img src="${BASE_URL}/assets/icons/edit.png" class="photo-popup-name-edit" onclick="openChangeName(this)"/>
                            <div class="popup-container">
                                <div class="popup">
                                    <div class="popup-info-container">
                                        <div class="photo-popup-close">
                                            <img src="${BASE_URL}/assets/icons/close.png" class="photo-popup-close" onclick="closeChangeName(this)" />
                                        </div>
                                        <div class="registration-form">
                                            <div class="form-group">
                                                <input type="text" id="name${element['object_id']}" class="textfield" placeholder="New Name">
                                            </div>
                                            <button class="button-black" onclick="changeName(this)">Change Name</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="photo-popup-info-property">
                            <img src="${BASE_URL}/assets/icons/location.png" class="photo-popup-property-icon"/>
                            <p class="photo-popup-property-desc">${element['location']}</p>
                        </div>
                        <div class="photo-popup-info-property">
                            <img src="${BASE_URL}/assets/icons/date.png" class="photo-popup-property-icon"/>
                            <p class="photo-popup-property-desc">${element['date']}</p>
                        </div>
                        <br>
                        <h1 class="visibility-status">${element['isPublic'] == 0 ? "Others can't see this photo" : "Others can see this photo"}</h1>
                        <button class="button-black" onclick="changeStatus(this)">${element['isPublic'] == 0 ? "Show in My Profile" : "Hide From My Profile"}</button>
                    </div>
                    <button class="button-white" onclick="deletePhoto(this)">Delete This Photo</button>
                </div>
            </div>
        </div>
    `;

    photoCard.innerHTML = photoCardHTML;
    return photoCard;
}

function refresh(perpage, page, filter, public, sort) {
    container.innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getPublicById?perpage=${perpage}&page=${page}&filter=${filter}&public=${public}&sort=${sort}`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            var objectArray = responseObj.object;
            objectArray.forEach(element => {
                container.appendChild(
                    makePhoto(element)
                )
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
            console.log(this.responseText);
        }
    };
}

let len;

function setupLength(filter, public, current){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getLengthPublicById?filter=${filter}&public=${public}`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            len = responseObj.object.len;
            statePage.value = current
            displayPagination(len, current)
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
            refresh(12, clickedPage, textbox.value, filter.value, sortName.classList.contains('active') ? "1" : "0");
            statePage.value = clickedPage;
            displayPagination(len, clickedPage);
        };

        listPagination.appendChild(p);
    }

    leftButton.onclick = () => {
        const prevPage = Math.max(1, current - 1);
        refresh(12, prevPage, textbox.value, filter.value, sortName.classList.contains('active') ? "1" : "0");
        setupLength(textbox.value, filter.value, prevPage)
        statePage.value = prevPage;
        displayPagination(len, prevPage);
    };

    rightButton.onclick = () => {
        const nextPage = Math.min(Math.ceil(len / 12), current + 1);
        refresh(12, nextPage, textbox.value, filter.value, sortName.classList.contains('active') ? "1" : "0");
        setupLength(textbox.value, filter.value, nextPage)
        statePage.value = nextPage;
        displayPagination(len, nextPage);
    };
}

textbox &&
    textbox.addEventListener(
        "keyup",
        debounce(() => {
            refresh(12, 1, textbox.value, filter.value, "0")
            setupLength(textbox.value, filter.value, 1)
        }, DEBOUNCE_TIMEOUT)
    );

sortName.addEventListener('click', () => {
    sortName.classList.toggle("active")
    refresh(12, 1, textbox.value, filter.value, "1")
    setupLength(textbox.value, filter.value, 1)
})

filter.addEventListener('change', () => {
    if(sortName.classList.contains('active')){
        refresh(12, 1, textbox.value, filter.value, "1")
    }else{
        refresh(12, 1, textbox.value, filter.value, "0")
    }
    setupLength(textbox.value, filter.value, 1)
})


window.addEventListener(
    "load",
    debounce(() => {
        refresh(12, 1, "", "all", "0")
        setupLength("", "all", 1)
    }, DEBOUNCE_TIMEOUT)
);
