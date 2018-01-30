import $ from 'jquery';
import 'pixi.js';

import {
  TimelineMax
} from 'gsap';

let width = $(window).width();
let height = $(window).height();

var renderer = PIXI.autoDetectRenderer(width, height, {
  antialias: true
});
document.body.appendChild(renderer.view);

let loader = PIXI.loader;

// create the root of the scene graph
var stage = new PIXI.Container();

var container = new PIXI.Container();
container.position.x = renderer.width / 2;
container.position.y = renderer.height / 2;

let bg, bgFront, thing;

loader.add('first', 'img/2.jpg').add('second', 'img/1.jpg');

loader.load((laoder, resources) => {

  bg = new PIXI.Sprite(resources.first.texture);

  bg.anchor.x = 0.5;
  bg.anchor.y = 0.5;

  bg.position.x = renderer.width / 2;
  bg.position.y = renderer.height / 2;

  let windowAspect = width/height;
  let imageAspect = bg.width/bg.height;

  if(windowAspect > imageAspect) {
    bg.width = width;
    bg.height = width/imageAspect;
  } else {
    bg.height = height;
    bg.width = height*imageAspect;
  }

  stage.addChild(bg);


  // add a bunch of sprites

  bgFront = new PIXI.Sprite(resources.second.texture);
  bgFront.anchor.x = 0.5;
  bgFront.anchor.y = 0.5;

  container.addChild(bgFront);

  imageAspect = bgFront.width/bg.height;

  if(windowAspect > imageAspect) {
    bgFront.width = width;
    bgFront.height = width/imageAspect;
  } else {
    bgFront.height = height;
    bgFront.width = height*imageAspect;
  }

  stage.addChild(container);

  // let's create a moving shape
  thing = new PIXI.Graphics();
  stage.addChild(thing);
  thing.lineStyle(0);

  

  thing.beginFill(0x8bc5ff, 0.4);
  thing.moveTo(0, 0);
  thing.lineTo(width, 0);
  thing.lineTo(width, height * 0);
  thing.lineTo(0, height * 0);
  container.mask = thing;

  renderer.render(stage);
});







$('body').on('click', () => {
  let tl = new TimelineMax({
    onUpdate: () => {
      renderer.render(stage);
    }
  });
  let obj = {
    a: 0
  };
  bgFront.position.y -= 100;
  tl.to(obj, 1.2, {
    a: 1,
    ease: Power3.easeOut,
    onUpdate: function() {

      let middle = (obj.a * obj.a + obj.a) / 2;

      thing.clear();
      thing.beginFill(0x8bc5ff, 0.4);
      thing.moveTo(0, 0);
      thing.lineTo(width, 0);
      thing.lineTo(width, height * obj.a * obj.a);
      thing.lineTo(0, height * obj.a);

      let react = 'react(' + height * middle + 'px,' + width + 'px,' + height + 'px, 0)';
      let react2 = 'react(' + 0 + 'px,' + width + 'px,' + height * middle + 'px, 0)';

      $('.one').css('clip', react);
      $('.two').css('clip', react2);


    }
  })
    .to(bg.position, 1.2, {
      y: '+=100'
    }, 0)
    .to(bgFront.position, 1.2, {
      y: '+=100'
    }, 0)
    .to(bgFront.scale, 0.2, {
      x: '+=0.2',
      y: '+=0.2'
    }, 0.5);
});
