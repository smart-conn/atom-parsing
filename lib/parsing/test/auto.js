'use strict';
const path = require('path');

const _ = require('lodash');
const uuid = require('uuid');
const colors = require('colors');

const Lib = require('./lib');
const config = require('../config');
const parsing = require('../index');
const convertButton = require('../util/button/config');

class Test extends Lib {
  constructor() {
    super();
    this.config = config;
    this.evt = this.config.autoemitter;
    this.mqtt = this.config.mqtt;

    this.currLineNum = 0;
    this.mode = '';

    this.mqtt.on('message', (topic, payload) => {
      if (topic === 'interaction/script/keysbind') {
        let btns = [];
        try {
          btns = JSON.parse(payload.toString()).btns;
        } catch (e) {
          console.log(e);
        } finally {
          if (btns.length === 0) {
            console.log('Interaction: interaction mode keysbind is blank.');
          } else {
            let btn = _.sample(btns);
            while (btn === 'no') {
              btn = _.sample(btns);
            }
            this.evt.emit('btn', { btns, btn })
            this.btn(btn);
          }
        }
      } else if (topic === 'interaction/script/keywords') {
        let keywords = [];
        let correlationId = '';
        try {
          let json = JSON.parse(payload.toString())
          keywords = json.keywords;
          correlationId = json.correlationId;
        } catch (e) {
          console.log(e);
        } finally {
          if (keywords.length === 0) {
            console.log('Interaction: choice mode keywords is blank.');
          } else {
            let keyword = _.sample(keywords);
            this.evt.emit('keyword', { keyword, keywords });
            this.reply(keyword);
          }
        }
      } else if (topic === 'sound_manager/play') {
        let json = JSON.parse(payload.toString());
        let soundId = json.soundId;
        let file = path.basename(json.file);
        this.evt.emit('play', { file });
        this.mqtt.publish('sound_manager/' + soundId + '/complete', JSON.stringify({}));
      } else if (topic === 'interaction/script/line') {
        let json = JSON.parse(payload.toString());
        this.evt.emit('line', { line: json.line, mode: json.mode });
      }
    });
  }
}

let test = new Test();
