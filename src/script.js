"use strict";

import {
  Scene,
  Color,
  AmbientLight,
  PerspectiveCamera,
  SphereGeometry,
  MeshStandardMaterial,
  LoadingManager,
  TextureLoader,
  WebGLRenderer,
  BackSide,
  Mesh,
  SRGBColorSpace,
  NearestFilter
} from "three";

import panoImage from "./../assets/beach.jpeg";
import panoImage2 from "./../assets/beach_depth.png";

import "./style.css";

window.addEventListener("load", function () {
  let camera, scene, renderer, skybox;
  let height = 0;

  init();
  animate();

  function init() {
    const container = document.getElementById("container");

    scene = new Scene();
    scene.background = new Color(0x101010);

    const light = new AmbientLight(0xffffff, 3.3);
    scene.add(light);

    camera = new PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      50
    );

    scene.add(camera);

    const panoSphereGeo = new SphereGeometry(30, 500, 500);

    const panoSphereMat = new MeshStandardMaterial({
      side: BackSide,
      displacementScale: -28.0,
    });

    skybox = new Mesh(panoSphereGeo, panoSphereMat);

    const manager = new LoadingManager();
    const loader = new TextureLoader(manager);

    loader.load(panoImage, function (texture) {
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = NearestFilter;
      texture.generateMipmaps = false;
      skybox.material.map = texture;
    });

    loader.load(panoImage2, function (depth) {
      depth.minFilter = NearestFilter;
      depth.generateMipmaps = false;
      skybox.material.displacementMap = depth;
    });

    manager.onLoad = function () {
      scene.add(skybox);
    };

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.useLegacyLights = false;

    container.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize);

    height = document.body.clientHeight;
    height -= window.innerHeight;
    window.addEventListener("scroll", scrollAction);
  }

  function scrollAction() {
    let scrollAmount = window.pageYOffset;
    scrollAmount = scrollAmount / height;
    scrollAmount *= Math.PI * 2;
    skybox.rotation.y = scrollAmount;

    skybox.position.y = Math.sin(scrollAmount * 2);
    skybox.position.x = Math.sin(scrollAmount * 2) * 2;
  }

  function onWindowResize() {
    height = document.body.clientHeight;
    height -= window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }
});
