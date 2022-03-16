import App from "./App.svelte";
import smoothscroll from "smoothscroll-polyfill";
import "./styles.css";

smoothscroll.polyfill();

const app = new App({
  target: document.getElementById("app"),
});

export default app;
