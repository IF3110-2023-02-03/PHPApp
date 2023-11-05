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
    let stat = object.parentElement.children[7];
    if (object.innerText == "Show in My Profile") {
        object.innerText = "Hide from My Profile";
        stat.innerText = "Others can see this picture"
    } else {
        object.innerText = "Show in My Profile";
        stat.innerText = "Others can't see this picture"
    }
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
                <div class="photo-popup-img-container">
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
                    <button class="button-white" onclick="deletePhoto(this)" id=${element['url_photo']}>Delete This Photo</button>
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

function setupLength(filter, public, current){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/public/object/getLengthPublicById?filter=${filter}&public=${public}`);

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            var len = responseObj.object.len;
            statePage.value = current
            displayPagination(len, current)
        }
    };
}

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
                if(sortName.classList.contains('active')){
                    refresh(12,(i+12)/12, textbox.value, filter.value, "1")
                }else{
                    refresh(12,(i+12)/12, textbox.value, filter.value, "0")
                }
                statePage.value =(i+12)/12
                displayPagination(len,(i+12)/12)
            }
            listPagination.appendChild(p)
        }
    }
}

// leftButton.addEventListener('click', () => {
//     if(sortName.classList.contains('active')){
//         refresh(12, statePage.value-1, textbox.value, filter.value, "1")
//     }else{
//         refresh(12, statePage.value-1, textbox.value, filter.value, "0")
//     }
//     setupLength(textbox.value, filter.value, statePage.value-1)
// })

// rightButton.addEventListener('click', () => {
//     if(sortName.classList.contains('active')){
//         refresh(12, statePage.value+1, textbox.value, filter.value, "1")
//     }else{
//         refresh(12, statePage.value+1, textbox.value, filter.value, "0")
//     }
//     setupLength(textbox.value, filter.value, statePage.value-1)
// })

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
