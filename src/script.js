"use strict";

import * as THREE from "three";

import './style.css';

import panoImage from '../assets/beach.jpeg';
import panoImage2 from '../assets/beach_depth.png';

window.addEventListener("load", function () {
  const panoImgPath = "../assets/beach.jpeg";
  const panoDepthMap = "../assets/beach_depth.png";

  let camera, scene, renderer, skybox;
  let height = 0;

  init();
  animate();

  function init() {
    const container = document.getElementById("container");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);

    const light = new THREE.AmbientLight(0xffffff, 3.3);
    scene.add(light);

    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      50
    );

    scene.add(camera);

    const panoSphereGeo = new THREE.SphereGeometry(30, 500, 500);

    const panoSphereMat = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
      displacementScale: -28.0,
    });

    skybox = new THREE.Mesh(panoSphereGeo, panoSphereMat);

    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);

    loader.load(panoImgPath, function (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      skybox.material.map = texture;
    });

    loader.load(panoDepthMap, function (depth) {
      depth.minFilter = THREE.NearestFilter;
      depth.generateMipmaps = false;
      skybox.material.displacementMap = depth;
    });

    manager.onLoad = function () {
      scene.add(skybox);
    };

    renderer = new THREE.WebGLRenderer({ antialias: true });
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
