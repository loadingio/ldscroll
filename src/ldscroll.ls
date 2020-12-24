main = (opt={}) ->
  @opt = opt
  root = opt.root
  @root = root = if typeof(root) == \string => document.querySelector(root) else if root => root else null
  @evt-handler = {}
  @io = new IntersectionObserver ((...args) ~> @handler.apply @, args), {root: @root}
  @tov = if opt.track-outside-view? => opt.track-outside-view else true

  # store node -> data mapping
  @map = if WeakMap? => new WeakMap! else new Map!

  # all nodes
  @nodes = []

  # all data
  @data = []

  # data for visible nodes
  @visible = []

  # data for nodes we should track
  @trackee = []

  @add opt.nodes
  @root.addEventListener \scroll, ~>
    list = if @tov => @data else @trackee
    list.map (d,i) ~>
      b = d.node.getBoundingClientRect!
      d.yb = (b.y + b.height) / window.innerHeight
      d.yt = b.y / window.innerHeight
      d.yp = d.yt / (1 - (d.yb - d.yt ))
      d.progress = if d.yp < 0 => -d.yt
      else if d.yp > 1 => 2 - d.yb
      else d.yp

    @fire \change, list
  @

main.prototype = Object.create(Object.prototype) <<< do
  on: (n, cb) -> @evt-handler.[][n].push cb
  fire: (n, ...v) -> for cb in (@evt-handler[n] or []) => cb.apply @, v
  get-visible: -> @visible
  add: (ns, tov = @tov) ->
    @nodes ++= (if Array.isArray(ns) => ns else [ns])
      .map -> if typeof(it) == \string => Array.from(document.querySelectorAll(it)) else it
      .reduce(((a,b) -> a ++ b), [])
    h = window.innerHeight
    ret = @nodes.map (it,i) ~>
      b = it.getBoundingClientRect!
      @map.set(it, d = {
        node: it
        tov: tov
        yt: b.y / h
        yb: (b.y + b.height) / h
      })
      d.yp = d.yt / (1 - (d.yb - d.yt))
      d.progress = if d.yp < 0 => -d.yt
      else if d.yp > 1 => 2 - d.yb
      else d.yp

      @io.observe it
      d
    @data ++= ret
    @trackee ++= ret.filter -> it.tov
  handler: (entries) ->
    ret = entries
      .map (entry) ~>
        if (d = @map.get entry.target) => d.entry = entry
        return d
      .filter (d) ~>
        if !d or (d.visible == d.entry.isIntersecting) => return false
        v = d.visible = d.entry.isIntersecting
        [in-visible, in-trackee] = [(d in @visible), (d in @trackee)]
        if v and !in-visible => @visible.push d
        if !v and in-visible => @visible.splice(@visible.indexOf(d), 1)
        if !d.tov =>
          if v and !in-trackee => @trackee.push d
          if !v and in-trackee => @trackee.splice(@trackee.indexOf(d), 1)
        return true

    if ret.length => @fire \change, ret

window.ldscroll = main
