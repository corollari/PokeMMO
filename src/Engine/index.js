import * as cfg from "../cfg";

import math from "../Math";

import {
  inherit,
  getWGLContext,
  ajax as $GET,
  parseString
} from "./utils";

import * as map from "./Map/functions";
import * as sound from "./sound";
import * as logic from "./logic";
import * as entity from "./Entity/functions";

import Map from "./Map";
import Camera from "./Camera";
import Editor from "./Editor";
import MiniMap from "./MiniMap";
import Language from "./Language";
import Controller from "./Controller";
import Environment from "./Environment";
import Notification from "./Notification";
import DisplayObject from "./DisplayObject";

EventTarget.prototype.addEventListenerRunOnce = function(name, callback) {
    const eventWrapper = (event) => {
        this.removeEventListener(name, eventWrapper);
        callback(event);
    };
    
    this.addEventListener(name, eventWrapper);
};

/**
 * Engine
 * @class Engine
 * @export
 */
export default class Engine extends DisplayObject {

  /**
   * @param {Object}   instance
   * @param {Function} resolve
   * @constructor
   */
  constructor(instance, resolve) {

    super(null);

    /**
     * Instance
     * @type {Object}
     */
    this.instance = instance;

    /**
     * Current map
     * @type {Object}
     */
    this.currentMap = null;

    /**
     * Node
     * @type {Object}
     */
    this.node = this.instance.canvasNode;

    /**
     * WebGL Node
     * @type {Object}
     */
    this.glNode = this.instance.glNode;

    /**
     * Context
     * @type {Object}
     */
    this.context = this.node.getContext("2d");

    /**
     * WebGL context
     * @type {Object}
     */
    this.glContext = null;

    /** Attach webgl context */
    if (cfg.WGL_SUPPORT && this.glNode) {
      this.glContext = getWGLContext(this.glNode);
    }

    /**
     * Parsed maps
     * @type {Object}
     */
    this.maps = {};

    /**
     * Local entity ref
     * @type {Object}
     */
    this.localEntity = null;

    /**
     * Renderer instance
     * @type {Object}
     */
    this.renderer = null;

    /**
     * Connection instance
     * @type {Object}
     */
    this.connection = null;

    /**
     * Environment instance
     * @type {Object}
     */
    this.language = null;

    /**
     * Camera object
     * @type {Object}
     */
    this.camera = null;

    /**
     * Editor instance
     * @type {Object}
     */
    this.editor = null;

    /**
     * MiniMap instance
     * @type {Object}
     */
    this.mini = null;

    /**
     * Environment instance
     * @type {Object}
     */
    this.environment = null;

    /**
     * Controller instance
     * @type {Object}
     */
    this.controller = null;

    this.setup(resolve);

  }

  /**
   * Setup process
   * @param {Function} resolve
   */
  setup(resolve) {

    /**
     * Environment instance
     * @type {Object}
     */
    this.language = new Language(() => {

      this.camera = new Camera(this);
      this.mini = new MiniMap(this);
      this.editor = new Editor(this);
      this.controller = new Controller(this);
      this.environment = new Environment(this);

      this.camera.scale = cfg.MIN_SCALE;

      this.handleAdressBar();

      resolve();

    });

    return void 0;

  }

  /**
   * Scan the adressbar and fetch
   * configuration parameters
   */
  handleAdressBar() {

    let ii = 0;
    let length = 0;

    let tmp = null;
    let key = null;
    let val = null;

    let params = [];

    let search = window.location.search;

    if (search.length <= 0) return void 0;

    search = search.replace("?", "");
    params = search.split("&");

    length = params.length;

    for (; ii < length; ++ii) {
      tmp = params[ii].split("=");
      /** Try uppercase */
      key = tmp[0].toUpperCase();
      val = tmp[1] === void 0 ? null : tmp[1];
      /** Try lowercase */
      if (cfg[key] === void 0) {
        key = tmp[0];
      }
      /**
       * Config key doesn't exist |
       * Value to write is null
       */
      if (cfg[key] === void 0 || val === null) continue;
      val = parseString(val);
      if (val === null) continue;
      cfg[key] = val;
    };

  }

  /**
   * Add a world
   */
  addWorld(path, resolve) {

    $GET(path).then(this::function(data) {
      let world = new Function(data)();
      console.log(world);
      if (resolve instanceof Function) {
        return (resolve());
      }
    });

  }

  /**
   * @param {Number} width
   * @setter
   */
  set width(width) {
    this.width = width || 0;
    this.camera.width = this.width;
  }

  /**
   * @param {Number} height
   * @setter
   */
  set height(height) {
    this.height = height || 0;
    this.camera.height = this.height;
  }

  /**
   * Sort layers and entities
   */
  sort() {

    this.depthSort(this.currentMap.entities);

    return void 0;

  }

  /**
   * @param {Array} array
   */
  depthSort(array) {

    let ii = 0;
    let jj = 0;

    let key = null;

    let length = array.length;

    for (; ii < length; ++ii) {
      jj = ii;
      key = array[jj];
      for (;
        jj > 0 &&
        (array[jj - 1].position.y + -array[jj - 1].z + array[jj - 1].yMargin + (array[jj - 1].size.y * array[jj - 1].scale)) * array[jj - 1].zIndex >
        (key.position.y + -key.z + key.yMargin + (key.size.y * key.scale)) * key.zIndex;
        --jj
      ) {
        array[jj] = array[jj - 1];
      };
      array[jj] = key;
    };

    return void 0;

  }

  /**
   * Trigger a ping
   * @param {Number} x
   * @param {Number} y
   */
  ping(x, y) {

    let offset = this.camera.getGameMouseOffset(x, y);

    let map = this.currentMap;

    let tpl = map.objectTemplates["ping"];

    tpl.x = offset.x;
    tpl.y = offset.y;
    tpl.z = 0;

    let pushEntity = map.addEntity(tpl);

    pushEntity.opacity = .0;
    pushEntity.fadeIn(2);
    pushEntity.lifeTime = this.renderer.now + 60;

    pushEntity.type = cfg.TYPES.Ping;

    map.entities.push(pushEntity);

  }

  /**
   * Trigger a notification
   * @param {Object} entity
   * @param {String} msg
   */
  notify(entity, msg, type) {

    let map = this.currentMap;

    let isLocalEntity = this.localEntity !== null && entity.id !== this.localEntity.id;

    let notification = new Notification(this, {
      sprite: null,
      hasShadow: false,
      width: math.roundTo(this.context.measureText(String(msg)).width, cfg.DIMENSION),
      height: 16,
      msg: msg,
      follow: entity,
      style: type || "ChatBubble",
      fade: isLocalEntity || entity instanceof Map,
      sound: isLocalEntity,
      absolute: entity instanceof Map
    });

    map.entities.push(notification);

  }

  /**
   * Local entity walk to
   * @param {Number} x
   * @param {Number} y
   */
  walkByMouse(x, y) {

    let local = this.localEntity;

    if (local === null) return void 0;

    let offset = this.camera.getGameMouseOffset(x, y);

    local.walkTo(
      offset.x, offset.y
    );

  }

  /**
   * Get language dependant string
   * @param  {String} str
   * @return {String}
   */
  getString(str) {
    return (
      this.language.get(this.language.strBase + str)
    );
  }

  /**
   * Get uppercased string
   * @param  {String} str
   * @return {String}
   */
  getUpperCaseString(str) {
    return (
      this.getString(str).toUpperCase()
    );
  }

  /**
   * Let all entities expect local jump
   * @param {Number} amount
   */
  everythingJump() {
    let ii = 0;
    for (let entity of game.engine.currentMap.entities) {
      ++ii;
      if (entity.id === this.localEntity.id) continue;
      setTimeout(function() {
        entity.jump();
      }, ii * 25);
    };
  }

  /**
   * Rotate all entities expect local
   * @param {Number} amount
   */
  everythingRotate(amount) {
    let ii = 0;
    for (let entity of game.engine.currentMap.entities) {
      ++ii;
      if (entity.id === this.localEntity.id) continue;
      entity.rotate(amount);
    };
  }

}

inherit(Engine, map);
inherit(Engine, logic);
inherit(Engine, sound);
inherit(Engine, entity);
