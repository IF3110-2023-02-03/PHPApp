const searchbar = document.getElementById('searchbar');
const content = document.getElementById('content');
const backButton = document.getElementById('back-button');
const container = document.getElementById('content');
const buttonSearch = document.getElementById('button-search')
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

buttonSearch.addEventListener('click', function(){
    content.innerHTML = ""
    getContentCreators(1, searchbar.ariaValueText || '')
})

function getContentCreators(page, filter){
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        'http://localhost:8000/api/following'
    )
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(`
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <getContentCreators xmlns="http://services.example.org/">
                    <arg0 xmlns="">${page}</arg0>
                    <arg1 xmlns="">12</arg1>
                    <arg2 xmlns="">${filter}</arg2>
                    <arg3 xmlns="">${localStorage.getItem("id")}</arg3>
                    <arg4 xmlns="">ini_api_key_monolitik</arg4>
                </getContentCreators>
            </Body>
        </Envelope>
    `)
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
    xhr.open(
        "POST",
        "http://localhost:8000/api/following"
    );
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(`
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <requestFollow xmlns="http://services.example.org/">
                    <arg0 xmlns="">${params[0]}</arg0>
                    <arg1 xmlns="">${localStorage.getItem("id")}</arg1>
                    <arg2 xmlns="">${params[2]}</arg2>
                    <arg3 xmlns="">${localStorage.getItem("fullname")}</arg3>
                    <arg4 xmlns="">${params[1]}</arg4>
                    <arg5 xmlns="">${localStorage.getItem("username")}</arg5>
                    <arg6 xmlns="">ini_api_key_monolitik</arg6>
                </requestFollow>
            </Body>
        </Envelope>
    `);
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
            <img class="creator-left-img" src=${url}/>
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
        "POST",
        "http://localhost:8000/api/following"
    );
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(`
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <getContent xmlns="http://services.example.org/">
                    <arg0 xmlns="">${localStorage.getItem("id")}</arg0>
                    <arg1 xmlns="">${1}</arg1>
                    <arg2 xmlns="">5</arg2>
                    <arg3 xmlns="">ini_api_key_monolitik</arg3>
                </getContent>
            </Body>
        </Envelope>
    `);
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
        <img class="photo-img" src="<?= BASE_URL ?>/assets/images/register-page.png"/>
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