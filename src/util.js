

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

// https://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
function getHashParams(hashString = false) {

  let hash = window.location.hash
  if(hashString) hash = hashString
  var hashParams = {};
  var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = hash.substring(1);

  while (e = r.exec(q))
   hashParams[d(e[1])] = d(e[2]);

  if(hashString === false){
    if(window.frameElement){
      extend(hashParams, getHashParams(window.parent.location.hash))
    }
  }

  return hashParams;
}


function setHashParams(param, values){
  const loc = window.frameElement ? window.parent.location : window.location
  let params = getHashParams()
  const toAdd = {}

  if(values.length > 0) {
    toAdd[param] = values
  } else {
    delete params[param]
  }
  extend(params, toAdd)
  if(window.frameElement) delete params.lang


  const hashStrings = []

  for(let i in params) {
    if(params[i]) hashStrings.push(`${i}=${params[i]}`)
  }
  loc.hash = hashStrings.join('&')
}

// JavaScript equivalent of jQuery's extend method
// https://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method
function extend(){
  for(var i=1; i<arguments.length; i++)
    for(var key in arguments[i])
      if(arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

// Send Ajax GET requests
// https://plainjs.com/javascript/ajax/send-ajax-get-and-post-requests-47/
function ajax(url, success) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();
  return xhr;
}


export { saveAs, sortLocale, intersect, getHashParams, setHashParams, ajax, extend }
