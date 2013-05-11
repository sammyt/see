(function(){

see = function(ptn){
  var targets = []

  return function(selection){
    var fn = ast(tokenize(ptn), targets), ans

    ans = arguments.length == 1 ?
        fn(selection, targets)  
      : fn(d3.select(this), targets)

    if(!targets.length) return ans
    return targets.length > 1 ? targets : targets[0]
  }
}

see.d = function(d){ return d }
see.d.pluck = function(prop){
  return function(d){ return d[prop] }
}


function cat(i){
  return [].concat(i)
}

function childrenOf(sel){
  return function(){ return sel.node().children }
}

function hasChild(sel, selector, targets){
  return !sel.selectAll(childrenOf(sel)).filter(selector).empty()
}


function ast(list, targets){
  var nodes = { '>' : decend , '+' : sib }
    , curr = list.shift()
    , peek = list.shift()
    , fn


  function decend(parent, child){
    return function(sel){
      var p = parent(sel)
      d3.select(p).call(child)
      return p
    }
  }

  function sib(bro, sis){
    return function(sel){
      return cat(bro(sel)).concat(sis(sel))
    }
  }

  function tag(n){
    return function(sel){
      var s = sel.append(n.tag)
      if(n.classifiers){
        n.classifiers.forEach(function(c){
          s.classed(c, true)
        })
      }
      if(n.attributes){
        Object.keys(n.attributes)
          .forEach(function(k){
            s.attr(k, n.attributes[k])
          })
      }
      if(n.target) targets.push(s.node())

      return s.node() 
    } 
  }

  if(fn = nodes[peek]) return fn(ast(cat(curr), targets), ast(list, targets))
  if(curr instanceof Array) return ast(curr, targets)
  return tag(curr)
}

function tokenize(ptn){
  var i = 0
    , root = []
    , parts = root
    , parents = []
    , curr

  function word(sub){
    var match = sub.match(/([\w-]+)(\[(.*)\])*(\.([\w-]+))*/)
      , w = match[1]
      , hasAttrs = sub.substr(w.length).match(/^(\[(.*)\])/)
      , attrLen = hasAttrs ? hasAttrs[0].length : 0
      , all = match[0]
      , token = {tag:w}

    i += all.length - 1
    
    if(hasAttrs){
      token.attributes = {}
      var pair = /((\w*)=[\'|\"](.*)[\'|\"])/
        , s = sub.substr(2)
        , m

      while(m = s.match(pair)){
        token.attributes[m[2]]= m[3]
        s = s.substr(m[0].length)
      }
    }

    if(all.length > w.length + attrLen){
        token.classifiers = all.substr(
            w.length + attrLen + 1
          , all.length
          )
          .split('.')
    }
    return token
  }

  function multiply(str){
    var count = str.match(/\d+/)[0]
      , next = parts[parts.length - 1]

    for(var j = 0; j<count - 1; j++){
      parts.push('+')
      parts.push(next)
    }

    i+= count.length
  }

  var target = false
    , w

  while(i<ptn.length){
    curr = ptn[i]
    switch(curr){
      
      case '$':
        target = true
        break;

      case '*':
        multiply(ptn.substr(i, ptn.length - i))
        break;

      case '>':
      case '+':
        parts.push(curr)
        break;

      case '(':
        parents.push(parts)
        parts.push(parts = [])
        if(target){ parts.target = true; target = false }
        break;

      case ')':
        parts = parents.pop()
        break;

      default:
        parts.push(w = word(ptn.substr(i, ptn.length - i)))
        if(target) { w.target = true; target = false }
        break;
    }
    i++
  }
  return root
}

see._tokenize = tokenize 


if (typeof module === 'object' && module.exports) {
  d3 = require('d3')
  module.exports = see
}

})()


