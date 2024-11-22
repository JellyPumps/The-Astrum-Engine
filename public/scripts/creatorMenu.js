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

function dropHandler(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    document.getElementById("fileInput").files = files;
    handleFileSelection();
}

function dragOverHandler(event) {
    event.preventDefault();
}

async function handleFileSelection() {
    const fileInput = document.getElementById("fileInput");
    const files = Array.from(fileInput.files);

    // Validate the number of files
    if (files.length !== 3) {
        alert("Please upload exactly 3 files: tilemap, objectmap, and spritemap.");
        return;
    }

    // Expected file types (optional validation by name or type)
    const requiredFiles = ["tilemap", "objectmap", "spritemap"];
    const fileNames = files.map(file => file.name);
    const missingFiles = requiredFiles.filter(req => 
        !fileNames.some(name => name.toLowerCase().includes(req))
    );

    if (missingFiles.length > 0) {
        alert(`Missing required files: ${missingFiles.join(", ")}`);
        return;
    }

     // Iterate through each file and process it
     for (const file of files) {
        const fileName = file.name.split(".")[0]; // Get the file name without extension
        const binaryData = await readFileAsArrayBuffer(file);

        // Assume parseBinaryImages splits binaryData into individual images
        const images = parseBinaryImages(binaryData);

        // Store images in IndexedDB
        await storeInIndexedDB(fileName, images);
    }

    // Proceed to the next scene
    sceneManager.loadScene("creator");
    closeFilePrompt();
}

// Reads a file as ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Simulated function to parse binary images from file content
function parseBinaryImages(binaryData) {
    // Example: Split binary data into chunks (custom parsing logic depends on your format)
    const imageCount = 10; // Assume there are 10 images
    const imageSize = binaryData.byteLength / imageCount; // Example: fixed-size images
    const images = [];

    for (let i = 0; i < imageCount; i++) {
        images.push(binaryData.slice(i * imageSize, (i + 1) * imageSize));
    }

    return images;
}

// Stores parsed images in IndexedDB
async function storeInIndexedDB(dbName, images) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "id" }); // Store image with unique id
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");

            images.forEach((image, index) => {
                store.put({ id: index, data: image });
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };

        request.onerror = () => reject(request.error);
    });
}   
