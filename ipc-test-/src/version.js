let version = 0;
const get_Version = async () => {
  version = await window.api.getVersion();
  console.log(version);
  document.getElementById("verzionen").innerText = `${version}`;
};
