main = ->
  @evt-handler = {}
  @
main.prototype = Object.create(Object.prototype) <<< do
  on: (n, cb) -> @evt-handler.[][n].push cb
  fire: (n, ...v) -> for cb in (@evt-handler[n] or []) => cb.apply @, v

#  (new IntersectionObserver (-> if it.0 and it.0.isVisible => ... ), {}).observe(node)
if window? => window.ldscroll = main
