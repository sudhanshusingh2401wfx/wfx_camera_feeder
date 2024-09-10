let cameraStream = null;

function startCamera() {
    const video = document.getElementById('camera');
    const startButton = document.getElementById('start-button');
    const closeCameraButton = document.getElementById('close-camera-button');
    document.getElementById('start-button').style.display = 'none';

    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment'
        }
    }).then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        startButton.style.display = 'none';
        video.style.display = 'block';
        closeCameraButton.style.display = 'block';
        video.addEventListener('loadedmetadata', () => {
            scanQRCode();
        });
    }).catch(err => {
        console.error('Error accessing the camera: ', err);
        alert('Could not access the camera. Please check camera permissions and try again.');
    });
}

function closeCamera() {
    const video = document.getElementById('camera');
    const closeCameraButton = document.getElementById('close-camera-button');

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    video.style.display = 'none';
    closeCameraButton.style.display = 'none';
    document.getElementById('start-button').style.display = 'block';
    hideAvatarContainer();
}

function scanQRCode() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

            if (qrCode?.data) {
                if (!window.curr_data || (window.curr_data != qrCode.data)) {
                    window.curr_data = qrCode.data;
                    hideAvatarContainer();
                    setTimeout(function () {
                        showAvatar(qrCode.data);
                    }, 1000);
                }
            }
        }
    }, 500);
}

function showAvatar(text) {
    const avatarContainer = document.getElementById('avatar-container');
    var dialog = document.querySelector('#dialog');
    dialog.innerText = text;
    avatarContainer.style.display = 'block';
}

function hideAvatarContainer() {
    const avatarContainer = document.getElementById('avatar-container');
    avatarContainer.style.display = 'none';
}

document.getElementById('start-button').addEventListener('click', startCamera);
document.getElementById('close-button').addEventListener('click', hideAvatarContainer);
document.getElementById('close-camera-button').addEventListener('click', closeCamera);
