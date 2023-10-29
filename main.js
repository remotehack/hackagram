console.log("Hackergram!")

const { origin, pathname } = window.location
const uri = origin + pathname;
console.log(uri)

auth0
    .createAuth0Client({
        domain: "dev-l2qhix4unqfdzpmz.uk.auth0.com",
        clientId: "NmlgknqQLop7qFkGcMeuLMFJpoPQVSPH",
        authorizationParams: {
            redirect_uri: uri,
            audience: 'https://hackergram.benfoxall.workers.dev'
        },
    })
    .then(async (auth0Client) => {
        // Assumes a button with id "login" in the DOM
        const loginButton = document.getElementById("login");

        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.loginWithRedirect();
        });

        if (
            location.search.includes("state=") &&
            (location.search.includes("code=") || location.search.includes("error="))
        ) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, uri);
        }

        //Assumes a button with id "logout" in the DOM
        const logoutButton = document.getElementById("logout");

        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.logout({
                returnTo: uri,
            });
        });

        const isAuthenticated = await auth0Client.isAuthenticated();
        const userProfile = await auth0Client.getUser();

        // Assumes an element with id "profile" in the DOM
        const profileElement = document.getElementById("profile");

        if (isAuthenticated) {
            loginButton.style.display = "none";
            profileElement.style.display = "block";
            profileElement.innerHTML = `
            <p>${userProfile.name}</p>
            <img src="${userProfile.picture}" referrerpolicy="no-referrer" style="max-width: 100px" />
          `;

            const token = await auth0Client.getTokenSilently();
            console.log("TOKEN:", token)

            fetch('https://hackergram.benfoxall.workers.dev', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.text())
                .then(d => console.log(">>>", d))

        } else {
            profileElement.style.display = "none";
            logoutButton.style.display = "none";
            document.getElementById("photo").style.display = "none";
        }
    });



document.querySelector('#photo').addEventListener('click', () => {
    takePhoto();
});


async function takePhoto() {
    const video = document.createElement('video');
    video.autoplay = true;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    document.body.appendChild(video);
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    video.play();

    await new Promise(resolve => video.onclick = resolve);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpg');

    video.remove()

    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;

    const photolist = document.querySelector('#photolist')
    const photo = document.createElement('img')
    photo.src = dataUrl
    const li = document.createElement('li')
    li.appendChild(photo)

    // photolist.appendChild(li)
    photolist.insertBefore(li, photolist.firstChild);

}
