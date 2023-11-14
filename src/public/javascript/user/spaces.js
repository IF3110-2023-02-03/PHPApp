const searchbar = document.getElementById('searchbar');
const content = document.getElementById('content');
const backButton = document.getElementById('back-button');
const container = document.getElementById('content');
const buttonSearch = document.getElementById('button-search')
let buttonFollows = Array.from(document.getElementsByClassName('button-follow'))

window.addEventListener('DOMContentLoaded', function() {
    addPhoto();
    addBroadcast();
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
            } else {
                console.error("HTTP error:", this.status);
            }
        }
    }
}

function reqFollow(e){
    const params = e.target.id.split("-")
    const xhr1 = new XMLHttpRequest();
    xhr1.open(
        "GET",
        `/public/user/data?csrf_token=${CSRF_TOKEN}`
    );
    xhr1.send();
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState === XMLHttpRequest.DONE) {
            const data = JSON.parse(this.responseText)
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

    addPhoto();
    addBroadcast();
})

function addPhoto() {
    let node = document.createElement('div');
    node.className = 'photo';

    const creator = `
    <div class="photo-img-container" id="hehe">
        <img class="photo-img" src="<?= BASE_URL ?>/assets/images/register-page.png"/>
    </div>
    <div class="photo-info-container">
        <div class="scrollable-spaces">
            <div class="photo-name-container">
                <h2 class="photo-name">kefnenfqwfpoq jpow fpojpof op fopjfpojopf jopf opfp  fpo fpu fopfpo fupo dwd hqowd odh owqh dow dqwo dhiowq dowqhd oiwq diowq doiwq dowq do wd volupt</h2>
            </div>
            <br>
            <div class="photo-info-property">
                <img src="<?= BASE_URL ?>/assets/icons/profile.png" class="photo-property-icon"/>
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

function addBroadcast() {
    let node = document.createElement('div');
    node.className = 'broadcast';

    const creator = `
        <p class="bc-head">NEW CONTENT COMING</p>
        <p class="bc-content">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, a commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
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