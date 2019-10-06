import axios from "axios";

export const get = () => {
  if (sessionStorage.getItem("settings") != null) {
    return JSON.parse(sessionStorage.getItem("settings"))
  } else {
    return null
  }
}

export const set = (key, value) => {
  if (sessionStorage.getItem("settings") != null) {
    let updatedSettings = JSON.parse(sessionStorage.getItem("settings"));
    updatedSettings[key] = value;
    axios.post('/mongodb/settings', updatedSettings)
      .then(() => {
        sessionStorage.setItem("settings", JSON.stringify(updatedSettings));
      }).catch((e) => {
        console.log("Error settting settings...", e);
    })
  }
}