(function(){

see = function(ptn){
  parts = _parse(ptn)
}


see._parse = function _parse(ptn){
  var i = 0
    , parts = []
    , curr
    , w

  function word(sub){
    return sub.match(/\w*/)[0]
  }

  while(i<ptn.length){
    curr = ptn[i]
    switch(curr){
      default:
        parts.push(w = word(ptn.substr(i, ptn.length - i)))
        i += w.length
        break;
    }
    i++
  }
  return parts
}

})()