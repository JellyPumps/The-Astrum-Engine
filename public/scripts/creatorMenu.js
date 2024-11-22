const overlay = document.getElementById("overlay");
const filePrompt = document.getElementById("filePrompt");
const fileInput = document.getElementById("fileInput");

function createNewCampaign() {
    const campaign_name = document.getElementById("new-campaign-name");

    if (campaign_name.value == "") {
        alert("Please enter a campaign name!");
        return;
    }

    showFilePrompt();
}

function showFilePrompt() {
    overlay.style.display = "block";
    filePrompt.style.display = "block";
}

function closeFilePrompt() {
    overlay.style.display = "none";
    filePrompt.style.display = "none";
}

function handleFileSelection() {
    const file = fileInput.files[0];
    if (file) {
      //process the file here
      sceneManager.loadScene("creator");
    } else {
      alert("No file selected.");
    }
    closeFilePrompt();
}