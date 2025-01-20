let dev = 0;
const isDev = () => {
  dev = window.api.isDev();
  document.getElementById("async").innerText = `DEV Now is Clikced!`;
};
