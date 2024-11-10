class SceneManager {
    constructor() {
        this.currentScene = null;
        this.currentSceneName = '';
        this.sceneData = {};
    }

    async loadScene(sceneName, data = {}) {
        // Avoid loading the same scene twice
        if (this.currentSceneName === sceneName) return;

        // Store the data for the scene
        this.sceneData = data;

        // Clear current scene if any
        if (this.currentSceneName) {
            document.getElementById('scene-container').innerHTML = '';
            this.removeSceneDepends();
        }

        // Load new scene
        await this.loadSceneDependencies(sceneName);
    }

    async loadSceneDependencies(sceneName) {
        // Load HTML
        const response = await fetch(`/scenes/${sceneName}.html`);
        const html = await response.text();
        document.getElementById('scene-container').innerHTML = html;

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `/css/${sceneName}.css`;
        document.head.appendChild(cssLink);

        // Load JavaScript
        const jsScript = document.createElement('script');
        jsScript.type = "text/javascript";
        jsScript.src = `/scripts/${sceneName}.js`;
        document.body.appendChild(jsScript);
    }

    getSceneData() {
        return this.sceneData;
    }

    removeSceneDepends() {
        const scripts = document.querySelectorAll(`script[src^='/scripts/${this.currentSceneName}.js]`);
        const links = document.querySelectorAll(`link[hfref^='/css/${this.currentSceneName}.css]`);

        scripts.forEach(script => script.remove());
        links.forEach(link => link.remove());
    }
}

const sceneManager = new SceneManager();

sceneManager.loadScene('mainMenu');