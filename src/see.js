(function(){

see = function(ptn){
  return function(selection){
    var fn = ast(tokenize(ptn))
    if(arguments.length == 1){
      return fn(selection)  
    }
    ans = fn(d3.select(this))
    console.log(ans)
    return ans
  }
}

function cat(i){
  return [].concat(i)
}

function decend(parent, child){
  return function(sel){
    parent = parent(sel)
    child(d3.select(parent))
    return parent
  }
}

function sib(bro, sis){
  return function(sel){
    bro(sel)
    sis(sel)
    return sel.node()
  }
}

function tag(n){
  return function(sel){
    var s = sel.select(n.tag)
    return s.empty() ? 
        sel.append(n.tag).node()
      : s.node()
  } 
}

var nodes = { '>' : decend , '+' : sib }

function ast(list){
  var curr = list.shift()
    , peek = list.shift()
    , fn

  if(fn = nodes[peek]) return fn(ast(cat(curr)), ast(list))
  if(curr instanceof Array) return ast(curr)

  return tag(curr)
}



function tokenize(ptn){
  var i = 0
    , root = []
    , parts = root
    , parents = []
    , curr

  function word(sub){
    var match = sub.match(/(\w+)(\.(\w+))*/)
      , w = match[1]
      , all = match[0]
      , token = {tag:w}

    i += all.length - 1
    
    if(all.length > w.length){
        token.classifiers = all.substr(w.length + 1, all.length).split('.')
    }

    return token
  }

  while(i<ptn.length){
    curr = ptn[i]
    switch(curr){
      
      case '>':
      case '+':
      case '$':
        parts.push(curr)
        break;

      case '(':
        parents.push(parts)
        parts.push(parts = [])
        break;

      case ')':
        parts = parents.pop()
        break;

      default:
        parts.push(word(ptn.substr(i, ptn.length - i)))
        break;
    }
    i++
  }
  return root
}

see._tokenize = tokenize 

})()