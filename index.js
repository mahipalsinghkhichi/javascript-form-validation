const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  validateInputs();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (usernameValue === "") {
    setError(username, "Username is required");
  } else {
    setSuccess(username);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 character.");
  } else {
    setSuccess(password);
  }

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
  } else {
    setSuccess(password2);
  }
};

var recordVideo= document.getElementById("record").addEventListener('click',()=>{


navigator.mediaDevices.getDisplayMedia({ video: true })
  .then(async (videoStream) => {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaStream = new MediaStream();
    videoStream.getVideoTracks().forEach((track) => mediaStream.addTrack(track));
    audioStream.getAudioTracks().forEach((track) => mediaStream.addTrack(track));

    const recordedChunks = [];
    const options = { mimeType: 'video/webm; codecs=vp9' };
    const mediaRecorder = new MediaRecorder(mediaStream, options);

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener('stop', () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      // Download the recorded video with audio
      chrome.downloads.download({ url: url, filename: 'recorded-video.webm' });
    });

    mediaRecorder.start();

    // Stop recording after a certain duration (e.g., 5 seconds)
    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  })
  .catch((error) => {
    console.error('Error accessing media devices:', error);
  });

})