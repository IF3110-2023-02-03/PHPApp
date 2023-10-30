const searchbar = document.getElementById('searchbar');
const content = document.getElementById('content');
const backButton = document.getElementById('back-button');
const container = document.getElementById('content');

window.addEventListener('DOMContentLoaded', function() {
    addPhoto();
    addBroadcast();
})

searchbar.addEventListener('focus', function() {
    content.innerHTML = "";
    backButton.style.display = "block";
    content.style.flexDirection = "row";

    for(let i = 0; i < 10; i++) {
        addCreator()
    }
})

function changeLike(object) {
    if (object.src == BASE_URL + "/assets/icons/heart.png") {
        object.src = BASE_URL + "/assets/icons/liked.png";
    } else {
        object.src = BASE_URL + "/assets/icons/heart.png";
    }          
}

function addCreator() {
    let node = document.createElement('div');
    node.className = 'creator';

    const creator = `
        <div class="creator-left">
            <img class="creator-left-img" src="<?= BASE_URL ?>/assets/images/register-page.png"/>
            <button class="black-button" id="follow-button">Follow</button>
        </div>
        <div class="creator-right">
            <p class="creator-name">John Doe</p>
            <p class="creator-desc">Lorem ipsum dolor sit amet, rit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim i</p>
            <p class></p>
            <div class="creator-prop">
                <img src="<?= BASE_URL ?>/assets/icons/heart.png" class="photo-property-icon" onclick="changeLike(this)" />
                <p class="creator-followers">128 Followers</p>
            </div>
            
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