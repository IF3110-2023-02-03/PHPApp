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

function isLiked(id, type) {
    const xhr = new XMLHttpRequest();
    let object;

    if (type == 'Broadcast') {
        object = document.getElementById('likestatbc' + id);
        xhr.open("GET", `http://localhost:3000/api/broadcast/like?user=${localStorage.getItem("username")}&id=${id}`);
    } else {
        object = document.getElementById('likestat' + id);
        xhr.open("GET", `http://localhost:3000/api/content/like?user=${localStorage.getItem("username")}&id=${id}`);
    }
    
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            console.log(responseObj);
            if (responseObj.data) {
                object.src = BASE_URL + "/assets/icons/liked.png";
            } else {
                object.src = BASE_URL + "/assets/icons/heart.png";
            }
        }
    };
}

function getComments(id, type) {
    const xhr = new XMLHttpRequest();

    if (type == 'Broadcast') {
        xhr.open("GET", `http://localhost:3000/api/broadcast/comment?user=${localStorage.getItem("username")}&id=${id}`);
    } else {
        xhr.open("GET", `http://localhost:3000/api/content/comment?user=${localStorage.getItem("username")}&id=${id}`);
    }
    
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            var responseObj = JSON.parse(this.responseText);
            console.log(responseObj, responseObj.data.length);
            
            let container;
            if (type == 'Broadcast') {
                container = document.getElementById('commentsbc' + id);
            } else {
                container = document.getElementById('comments' + id);
            }

            for (let i = 0; i < responseObj.data.length; i++) {
                let comment = makeUserComment(responseObj.data[i].message, responseObj.data[i].user);
                container.appendChild(comment);
            }
        }
    };
}

function addComment(object) {
    let object_id = object.parentElement.parentElement.parentElement.parentElement.id;
    let classname = object.parentElement.parentElement.parentElement.parentElement.className;
    let textfield;

    const xhr = new XMLHttpRequest();

    if (classname == 'broadcast') {
        textfield = document.querySelector(`#tfbc-comment${object_id}`)
        xhr.open("POST", "http://localhost:3000/api/broadcast/comment/" + object_id);
        xhr.setRequestHeader("Content-Type", "application/json");
    } else {
        textfield = document.querySelector(`#tf-comment${object_id}`)
        xhr.open("POST", "http://localhost:3000/api/content/comment/" + object_id);
        xhr.setRequestHeader("Content-Type", "application/json");
    }

    xhr.send(JSON.stringify({user: localStorage.getItem("username"), message: textfield.value}));
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            let comment = makeUserComment(textfield.value, localStorage.getItem("username"));
            let container;
            if (classname == 'broadcast') {
                container = document.getElementById('commentsbc' + object_id);
            } else {
                container = document.getElementById('comments' + object_id);
            }
            container.appendChild(comment);
            textfield.value = '';
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
    let object_id = object.parentElement.parentElement.parentElement.parentElement.id;
    let classname = object.parentElement.parentElement.parentElement.parentElement.className;

    if (object.src == BASE_URL + "/assets/icons/heart.png") {
        const xhr = new XMLHttpRequest();
        
        if (classname == 'broadcast') {
            xhr.open("POST", "http://localhost:3000/api/broadcast/like/" + object_id);
            xhr.setRequestHeader("Content-Type", "application/json");
        } else {
            xhr.open("POST", "http://localhost:3000/api/content/like/" + object_id);
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.send(JSON.stringify({user: localStorage.getItem("username")}));
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                object.src = BASE_URL + "/assets/icons/liked.png";
            }
        };
    } else {
        const xhr = new XMLHttpRequest();
        if (classname == 'broadcast') {
            xhr.open("DELETE", "http://localhost:3000/api/broadcast/like/" + object_id + "/" + localStorage.getItem("username"));
            xhr.setRequestHeader("Content-Type", "application/json");
        } else {
            xhr.open("DELETE", "http://localhost:3000/api/content/like/" + object_id + "/" + localStorage.getItem("username"));
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.send(JSON.stringify({user: localStorage.getItem("username")}));
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                object.src = BASE_URL + "/assets/icons/heart.png";
            }
        };
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
            res.data.broadcasts.map(bdc => addBroadcast(bdc.objectID, bdc.description, bdc.post_date))
        }
    };
}

function addPhoto(id, type, post_date, url, description) {
    let node = document.createElement('div');
    node.className = 'photo';
    node.id = id;

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
                <img src=${BASE_URL}/assets/icons/profile.png class="photo-property-icon"/>
                <p class="photo-property-desc" id="hedwd"></p>
            </div>
            <div class="photo-info-property">
                <img src="${BASE_URL}/assets/icons/heart.png" class="photo-property-icon" id="likestat${id}" onclick="changeLike(this)" />
                <p class="photo-property-desc">Like</p>
            </div>
            <div class="photo-info-property">
                <img src="${BASE_URL}//assets/icons/date.png" class="photo-property-icon"/>
                <p class="photo-property-desc">${post_date}</p>
            </div>
            <br>
            <h1 class="visibility-status">Comments</h1>
            <div class="comments-container" id="comments${id}">
            </div>
        </div>
        <div>
            <div class="form">
                <input type="text" id="tf-comment${id}" class="textfield2" placeholder="Write a comment"><br>    
                <input type="submit" onclick="addComment(this)" value="Send" class="button-black">
            </div>
        </div>
    </div>`

    node.innerHTML = creator;
    content.appendChild(node);
    isLiked(id, 'Content');
    getComments(id, 'Content');
}

function addBroadcast(id, description, date) {
    let node = document.createElement('div');
    node.className = 'broadcast';
    node.id = id;

    const creator = `
            <div class="photo-img-container">
                <p class="bc-content">${description}</p>
            </div>
            <div class="photo-info-container">
                <div class="scrollable-spaces">
                    <br/>
                    <div class="photo-info-property">
                        <img src=${BASE_URL}/assets/icons/profile.png class="photo-property-icon" />
                        <p class="photo-property-desc" id="hedwd"></p>
                    </div>
                    <div class="photo-info-property">
                        <img src="${BASE_URL}/assets/icons/heart.png" class="photo-property-icon" id="likestatbc${id}" onclick="changeLike(this)" />
                        <p class="photo-property-desc">Like</p>
                    </div>
                    <div class="photo-info-property">
                        <img src="${BASE_URL}//assets/icons/date.png" class="photo-property-icon"/>
                        <p class="photo-property-desc">${date}</p>
                    </div>
                    <br>
                    <h1 class="visibility-status">Comments</h1>
                    <div class="comments-container" id="commentsbc${id}">
                    </div>
                </div>
                <div>
                    <div class="form">
                        <input type="text" id="tfbc-comment${id}" class="textfield2" placeholder="Write a comment"><br>    
                        <input type="submit" onclick="addComment(this)" value="Send" class="button-black">
                    </div>
                </div>
            </div>` 

    node.innerHTML = creator;
    content.appendChild(node);
    isLiked(id, 'Broadcast');
    getComments(id, 'Broadcast');
}