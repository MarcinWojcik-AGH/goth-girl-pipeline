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
        resizable: false
      });
    }
  
    getData() {
      return {
        drewno: this.object.drewno || "umiarkowanie",
        kamienie: this.object.kamienie || "umiarkowanie",
        metale: this.object.metale || "umiarkowanie",
        zywnosc: this.object.zywnosc || "umiarkowanie",
        skory_i_futra: this.object.skory_i_futra || "umiarkowanie",
        sila_robocza: this.object.sila_robocza || "umiarkowanie"
      };
    }
  
    activateListeners(html) {
      super.activateListeners(html);
    }
  
    _updateObject(event, formData) {
      console.log(formData);
      for (let [key, value] of Object.entries(formData)) {
        this.object[key] = value;
      }
    }
  }
  
  Hooks.once('init', async function() {
    game.settings.registerMenu("resource-tracker", "resourceTrackerMenu", {
      name: "Resource Tracker",
      label: "Open Resource Tracker",
      hint: "Open the resource tracker to manage your resources.",
      icon: "fas fa-boxes",
      type: ResourceTracker,
      restricted: false
    });
  
    game.settings.register("resource-tracker", "resources", {
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
  
    console.log("Resource Tracker module loaded.");
  });
  
  Hooks.once('ready', async function() {
    game.settings.settings.get("resource-tracker.resources").onChange((value) => {
      console.log("Resources changed: ", value);
    });
  
    const resources = game.settings.get("resource-tracker", "resources");
    new ResourceTracker(resources, {}).render(true);
  });
  