

function sortLocale(opt, dir){
  const mult = (dir == 'desc') ? -1 : (dir == 'asc') ? 1 : 1

  if(typeof(opt) == 'string'){
    const key = opt
    return (a, b) => {
      if(!a[key] || !b[key]) return false
      return a[key].localeCompare(b[key]) * mult
    }
  } else if(typeof(opt) == 'object'){
    if(opt.key && opt.type){
      if(opt.key instanceof Array && opt.type == 'array'){
        const l = opt.key.length
        return (a, b) => {

          let t_a = a
          let t_b = b
          for(let i = 0; i < l; i++){
            t_a = t_a[opt.key[i]]
            t_b = t_b[opt.key[i]]
            if(!t_a || !t_b) {
              return false
            }

          }
          return t_a.localeCompare(t_b) * mult
        }
      }
    }
  }
}

function intersect(a,b){
  let small = null
  let big = null
  const r = []
  if(a.length > b.length) {
    small = b
    big = a
  } else {
    small = a
    big = b
  }
  for(let i = 0; i < small.length; i++){
    if(big.indexOf(small[i]) !== -1) r.push(small[i])
  }
  return r
}

// https://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
function getHashParams() {
  var hashParams = {};
  var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.hash.substring(1);

  while (e = r.exec(q))
   hashParams[d(e[1])] = d(e[2]);

  return hashParams;
}

function saveAs(blob, fileName) {
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    window.URL = window.URL || window.webkitURL;
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
  }

}


export { saveAs, sortLocale, intersect, getHashParams }
