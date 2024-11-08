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
        if (this.sceneName) {
            document.getElementById('scene-container').innerHTML = '';
            this.removeSceneDepends();
        }

        // Load new scene
        await this.loadSceneHTML(sceneName);
        await this.loadSceneCSS(sceneName);
        await this.loadSceneJS(sceneName);
    }

    async loadSceneHTML(sceneName) {
        const response = await fetch(`/scenes/${sceneName}.html`);
        const html = await response.text();
        document.getElementById('scene-container').innerHTML = html;
    }

    async loadSceneCSS(sceneName) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/css/${sceneName}.css`;
        document.head.appendChild(link);
    }
 
    async loadSceneJS(sceneName) {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = `/scripts/${sceneName}.js`;
        document.body.appendChild(script);
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