const searchbar = document.getElementById('searchbar');
const content = document.getElementById('content');
const backButton = document.getElementById('back-button');
const container = document.getElementById('content');
let buttonFollows = Array.from(document.getElementsByClassName('button-follow'))

window.addEventListener('DOMContentLoaded', function() {
    getContents();
})

searchbar.addEventListener('focus', function() {
    content.innerHTML = "";
    backButton.style.display = "block";
    content.style.flexDirection = "row";

    getContentCreators(1, '')
})

searchbar &&
    searchbar.addEventListener(
        "keyup",
        debounce((e) => {
            content.innerHTML = ""
            getContentCreators(1, e.target.value)
        }, DEBOUNCE_TIMEOUT)
    );

function getContentCreators(page, filter){
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `/public/SOAP/getContentCreators?page=1&filter=${searchbar.ariaValueText || ''}&id=${localStorage.getItem("id")}`
    )
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                const res = JSON.parse(this.responseXML.getElementsByTagName("return")[0].textContent)
                res.map(e => addCreator(e.username, e.fullname, e.description, e.userID, e.pp_url, e.status))
                buttonFollows = Array.from(document.getElementsByClassName('button-follow'))
                buttonFollows.forEach(btn => btn.addEventListener('click', reqFollow))
            } else {
                console.error("HTTP error:", this.status);
            }
        }
    }
}

function reqFollow(e){
    const params = e.target.id.split("-")
    const xhr = new XMLHttpRequest();

    const formData = new FormData();
    formData.append("creatorID", params[0]);
    formData.append("followerID", localStorage.getItem("id"));
    formData.append("creatorName", params[2]);
    formData.append("followerName", localStorage.getItem("fullname"));
    formData.append("creatorUsername", params[1]);
    formData.append("followerUsername", localStorage.getItem("username"));

    xhr.open(
        "POST",
        "/public/SOAP/reqFollow"
    );
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const data = this.responseXML
            console.log(data)
        }
    };
}

function changeLike(object) {
    if (object.src == BASE_URL + "/assets/icons/heart.png") {
        object.src = BASE_URL + "/assets/icons/liked.png";
    } else {
        object.src = BASE_URL + "/assets/icons/heart.png";
    }          
}

function addCreator(username, fullname, desc, id, url, status) {
    let node = document.createElement('div');
    node.className = 'creator';

    const creator = `
        <div class="creator-left">
            <img class="creator-left-img" src="http://localhost:3000/profiles/${url}"/>
            ${
                status === "REJECTED" ?
                `<button class="black-button button-follow" id="${id}-${username}-${fullname}">Follow</button>`
                :
                `<button class="black-button" id="${id}-${username}-${fullname}">${status === "PENDING" ? "Pending" : "Followed"}</button>`
            }
        </div>
        <div class="creator-right">
            <p class="creator-name">${fullname}</p>
            <p class="creator-username">${username}</p>
            <p class="creator-desc">${desc}</p>
            <p class></p>
        </div>`

    node.innerHTML = creator;
    content.appendChild(node);
}

backButton.addEventListener('click', function() {
    content.innerHTML = "";
    backButton.style.display = "none";
    content.style.flexDirection = "column";

    getContents()
})

function getContents(){
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `/public/SOAP//getContents?page=${1}&id=${localStorage.getItem("id")}`
    );
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const res = JSON.parse(this.responseXML.getElementsByTagName("return")[0].textContent)
            console.log(res)
            res.data.objects.map(obj => addPhoto(obj.objectID, obj.type, obj.post_date, obj.url, obj.description))
            res.data.broadcasts.map(bdc => addBroadcast(bdc.objectID, bdc.description))
        }
    };
}

function addPhoto(id, type, post_date, url, description) {
    let node = document.createElement('div');
    node.className = 'photo';

    const creator = `
    <div class="photo-img-container" id="hehe">
        <img class="photo-img" src="${"http://localhost:3000/objects/"+url}"/>
    </div>
    <div class="photo-info-container">
        <div class="scrollable-spaces">
            <div class="photo-name-container">
                <h2 class="photo-name">${description}</h2>
            </div>
            <br>
            <div class="photo-info-property">
                <img src=${url || ""} class="photo-property-icon"/>
                <p class="photo-property-desc" id="hedwd"></p>
            </div>
            <div class="photo-info-property">
                <img src="<?= BASE_URL ?>/assets/icons/heart.png" class="photo-property-icon" onclick="changeLike(this)" />
                <p class="photo-property-desc">Like</p>
            </div>
            <div class="photo-info-property">
                <img src="<?= BASE_URL ?>/assets/icons/date.png" class="photo-property-icon"/>
                <p class="photo-property-desc"></p>
            </div>
            <br>
            <h1 class="visibility-status">Comments</h1>
            <div class="comments-container" >
            </div>
        </div>
        <div>
            <div class="form">
                <input type="text"  class="textfield2" placeholder="Write a comment"><br>    
                <input type="submit" onclick="addComment(this)" value="Send" class="button-black">
            </div>
        </div>
    </div>`

    node.innerHTML = creator;
    content.appendChild(node);
}

function addBroadcast(id, description) {
    let node = document.createElement('div');
    node.className = 'broadcast';

    const creator = `
        <p class="bc-head">NEW CONTENT COMING</p>
        <p class="bc-content">${description}</p>
        <div class="bc-prop">
            <div class="photo-info-property">
                <img src="<?= BASE_URL ?>/assets/icons/heart.png" class="photo-property-icon" onclick="changeLike(this)" />
                <p class="photo-property-desc">Like</p>
            </div>
            <div class="photo-info-property">
                <img src="<?= BASE_URL ?>/assets/icons/date.png" class="photo-property-icon" onclick="changeLike(this)" />
                <p class="photo-property-desc">Date</p>
            </div>
        </div>`

    node.innerHTML = creator;
    content.appendChild(node);
}