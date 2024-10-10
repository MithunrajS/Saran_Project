let swiper = new Swiper(".mySwiper", {
    slidesPerView: 6,
    spaceBetween: 5,

})


async function getUploads() {
    try {
        const response = await fetch('http://localhost:3000/uploads/');
        const uploads = await response.json();
        uploads.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        // Process the uploads
        const postsDiv = document.getElementById('posts');
        postsDiv.innerHTML = '';
        uploads.forEach(upload => {
            const postDiv = document.createElement('div');
            const textElement = document.createElement('p');
            textElement.textContent = upload.text;
            const imageElement = document.createElement('img');
            imageElement.src = upload.image;
            postDiv.appendChild(textElement);
            postDiv.appendChild(imageElement);
            postsDiv.appendChild(postDiv);
        });
    } catch (error) {
        // Handle the error
    }
}

document.addEventListener('DOMContentLoaded', getUploads);

//............window scroll.................
window.addEventListener('scroll', () => {
    document.querySelector('.profile-popup').style.display = 'none'
    document.querySelector('.add-post-popup').style.display = 'none'
})

//..............start profile popups..............

document.querySelectorAll('#my-profile-picture').forEach(AllProfile => {
    AllProfile.addEventListener('click', () => {
        document.querySelector('.profile-popup').style.display = 'flex'
    })
});

document.querySelectorAll('.close').forEach(AllCloser => {
    AllCloser.addEventListener('click', () => {
        document.querySelector('.profile-popup').style.display = 'none'
        document.querySelector('.add-post-popup').style.display = 'none'
    })
})


document.querySelector('#profile-upload').addEventListener('change', () => {
    document.querySelectorAll('#my-profile-picture img').forEach(AllMyProfileImg => {
        AllMyProfileImg.src = URL.createObjectURL(document.querySelector('#profile-upload').files[0])
    })
})


//..............start profile popups..............
document.querySelector('#crate-lg').addEventListener('click', () => {
    document.querySelector('.add-post-popup').style.display = 'flex'
})

document.querySelector('#feed-pic-upload').addEventListener('change', () => {
    document.querySelector('#postImg').src = URL.createObjectURL(document.querySelector('#feed-pic-upload').
        files[0]);
})
//..............start add story..............
document.querySelector('#add-story').addEventListener('change', () => {
    document.querySelector('.story img').src = URL.createObjectURL(document.querySelector('#add-story').
        files[0]);
    document.querySelector('.add-story').style.display = 'none'
})

//........//higlight post input............
document.querySelector('.mini-button').addEventListener('click', () => {
    document.querySelector('.input-post').classList.add('boxshadow1')
})



//...............................


//..................liked bottan...........


document.querySelectorAll('.action-button span:first-child i').forEach(liked => {
    liked.addEventListener('click', () => {
        liked.classList.toggle('liked');
    })
})
//............. set timeout..............

setTimeout(() => {
    document.querySelector('.input-post').classList.remove('boxshadow')
}, 3000);


// Form upload
const form = document.getElementById('uploadForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
        await fetch(form.action, {
            method: form.method,
            mode: 'no-cors',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
    } catch (error) {
        // Handle the error
    }

    // Reset the form
    form.reset();

    await getUploads();
});