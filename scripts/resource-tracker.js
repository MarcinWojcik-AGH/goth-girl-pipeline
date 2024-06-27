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
      resizable: false
    });
  }

  getData() {
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
    };
  }

  activateListeners(html) {
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
  }
}

Hooks.once('init', async function() {
  console.log("Resource Tracker module init hook called");
  game.settings.registerMenu("goth-girl-pipeline", "resourceTrackerMenu", {
    name: "Resource Tracker",
    label: "Open Resource Tracker",
    hint: "Open the resource tracker to manage your resources.",
    icon: "fas fa-boxes",
    type: ResourceTracker,
    restricted: true
  });

  game.settings.register("goth-girl-pipeline", "resources", {
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
