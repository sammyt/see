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
    var w = sub.match(/\w*/)[0] 
    i += w.length - 1
    return w
  }

  while(i<ptn.length){
    curr = ptn[i]
    switch(curr){
      case '>':
        parts.push(curr)
        break;
      default:
        parts.push(word(ptn.substr(i, ptn.length - i)))
        break;
    }
    i++
  }
  return parts
}

})()