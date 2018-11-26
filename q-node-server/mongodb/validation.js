module.exports = {
  listen: (listen) => {
    const isListOfStrings = (list) => {
      let result = false;
      if (Array.isArray(list)){
        result = true;
        list.forEach(item => {
          if (typeof item !== "string"){
            result = false;
          }
        });
      }
      return result
    };

    return (
      listen.timestamp != null && typeof listen.timestamp === "number" &&
      listen.track != null && typeof listen.track === "string" &&
      listen.album != null && typeof listen.album === "string" &&
      listen.artists != null && isListOfStrings(listen.artists) &&
      listen.popularity != null && typeof listen.popularity === "number" &&
      listen.duration != null && typeof listen.duration === "number"
    )
  }
};