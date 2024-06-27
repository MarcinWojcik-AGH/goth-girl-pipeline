<<<<<<< HEAD
console.log("Resource Tracker module script loaded");

class ResourceTracker extends FormApplication {
  constructor(object, options) {
    super(object, options);
    console.log("ResourceTracker constructor called");
  }

  static get defaultOptions() {
    console.log("ResourceTracker defaultOptions called");
    const isGM = game.user.isGM;
    const template = isGM ? "modules/goth-girl-pipeline/templates/resource-tracker-gm.html" : "modules/goth-girl-pipeline/templates/resource-tracker-player.html";
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "resource-tracker",
      title: "Resource Tracker",
      template: template,
      width: 400,
      height: "auto",
      closeOnSubmit: false,  // Do not close on submit
=======
// scripts/resource-tracker.js
class ResourceTracker extends FormApplication {
  constructor(object, options) {
    super(object, options);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "resource-tracker",
      title: "Resource Tracker",
      template: "modules/resource-tracker/templates/resource-tracker.html",
      width: 400,
      height: "auto",
      closeOnSubmit: true,
>>>>>>> bfa505894eb5248fe166969c19dd8eb8943017b2
      resizable: false
    });
  }

  getData() {
<<<<<<< HEAD
    console.log("ResourceTracker getData called");
    const resources = game.settings.get("goth-girl-pipeline", "resources");
    return {
      drewno: resources.drewno || "umiarkowanie",
      kamienie: resources.kamienie || "umiarkowanie",
      metale: resources.metale || "umiarkowanie",
      zywnosc: resources.zywnosc || "umiarkowanie",
      skory_i_futra: resources.skory_i_futra || "umiarkowanie",
      sila_robocza: resources.sila_robocza || "umiarkowanie",
      isGM: game.user.isGM
=======
    return {
      drewno: this.object.drewno || "umiarkowanie",
      kamienie: this.object.kamienie || "umiarkowanie",
      metale: this.object.metale || "umiarkowanie",
      zywnosc: this.object.zywnosc || "umiarkowanie",
      skory_i_futra: this.object.skory_i_futra || "umiarkowanie",
      sila_robocza: this.object.sila_robocza || "umiarkowanie"
>>>>>>> bfa505894eb5248fe166969c19dd8eb8943017b2
    };
  }

  activateListeners(html) {
<<<<<<< HEAD
    console.log("ResourceTracker activateListeners called");
    super.activateListeners(html);
    if (game.user.isGM) {
      html.find('#apply-button').click(this._onApply.bind(this));
    } else {
      this.updatePlayerView(html);
      this.startAutoUpdate(html);
    }
  }

  async _onApply(event) {
    event.preventDefault();
    const formData = new FormData(this.element.find('form')[0]);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    if (game.user.isGM) {
      console.log("Updating resource values:", data);
      await game.settings.set("goth-girl-pipeline", "resources", data);
      game.socket.emit("module.goth-girl-pipeline", data);
      ui.notifications.info("Resource values updated.");
    }
  }

  async _updateObject(event, formData) {
    // This method is no longer used
  }

  updatePlayerView(html) {
    const resources = game.settings.get("goth-girl-pipeline", "resources");
    for (const [key, value] of Object.entries(resources)) {
      const element = html.find(`#${key}`);
      if (element.length > 0) {
        element.text(value);
        element.attr('class', `resource ${value}`);
      }
    }
  }

  startAutoUpdate(html) {
    this.interval = setInterval(() => {
      this.updatePlayerView(html);
    }, 500);
  }

  close() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    return super.close();
=======
    super.activateListeners(html);
  }

  async _updateObject(event, formData) {
    console.log(formData);
    await game.settings.set("resource-tracker", "resources", formData);
>>>>>>> bfa505894eb5248fe166969c19dd8eb8943017b2
  }
}

Hooks.once('init', async function() {
<<<<<<< HEAD
  console.log("Resource Tracker module init hook called");
  game.settings.registerMenu("goth-girl-pipeline", "resourceTrackerMenu", {
=======
  game.settings.registerMenu("resource-tracker", "resourceTrackerMenu", {
>>>>>>> bfa505894eb5248fe166969c19dd8eb8943017b2
    name: "Resource Tracker",
    label: "Open Resource Tracker",
    hint: "Open the resource tracker to manage your resources.",
    icon: "fas fa-boxes",
    type: ResourceTracker,
<<<<<<< HEAD
    restricted: true
  });

  game.settings.register("goth-girl-pipeline", "resources", {
=======
    restricted: false
  });

  game.settings.register("resource-tracker", "resources", {
>>>>>>> bfa505894eb5248fe166969c19dd8eb8943017b2
    name: "Resources",
    scope: "world",
    config: false,
    type: Object,
    default: {
      drewno: "umiarkowanie",
      kamienie: "umiarkowanie",
      metale: "umiarkowanie",
      zywnosc: "umiarkowanie",
      skory_i_futra: "umiarkowanie",
      sila_robocza: "umiarkowanie"
    }
  });

<<<<<<< HEAD
  console.log("Goth Girl Pipeline module loaded.");
});

Hooks.once('ready', async function() {
  console.log("Resource Tracker module ready hook called");
  const resources = game.settings.get("goth-girl-pipeline", "resources");
  new ResourceTracker(resources, {}).render(true);

  // Listen for the socket event to update the UI
  game.socket.on("module.goth-girl-pipeline", (data) => {
    console.log("Socket message received for resource update:", data);
    game.settings.set("goth-girl-pipeline", "resources", data).then(() => {
      console.log("Resources updated via socket:", data);
      const resources = game.settings.get("goth-girl-pipeline", "resources");
      if (ui.windows) {
        for (let app of Object.values(ui.windows)) {
          if (app instanceof ResourceTracker) {
            app.object = resources;
            if (!game.user.isGM) {
              app.updatePlayerView(app.element);
            }
            app.render(false);
          }
        }
      }
    });
  });

  Hooks.on("renderApplication", (app) => {
    if (app instanceof ResourceTracker) {
      console.log("ResourceTracker renderApplication hook called");
      const resources = game.settings.get("goth-girl-pipeline", "resources");
      app.object = resources;
      if (!game.user.isGM) {
        app.updatePlayerView(app.element);
      }
      app.render(false);
    }
  });
});
=======
  console.log("Resource Tracker module loaded.");
});

Hooks.once('ready', async function() {
  const resources = game.settings.get("resource-tracker", "resources");
  new ResourceTracker(resources, {}).render(true);

  // Listen for changes in the settings
  Hooks.on("updateSetting", (setting) => {
    if (setting.key === "resource-tracker.resources") {
      console.log("Resources changed: ", setting.value);
    }
  });
});
>>>>>>> bfa505894eb5248fe166969c19dd8eb8943017b2
