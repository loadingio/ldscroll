ldScroll = (opt) ->
  update = -> it.map -> console.log it
  @obs = new IntersectionObserver update, opt
  @watch = (n) ~> @obs.observe n
