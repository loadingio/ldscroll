# ldscroll

this is the repo for considering making a IntersectionObserver for both visibility checking and parallex effect. Not sure if we have to do this since there are already lots of parallex lib, and visibility check is just an one liner.

 * visible ( event )
  (new IntersectionObserver (-> if it.0 and it.0.isVisible => ... ), {}).observe(node)

 * scrolling ( percent )  for parallex 
   - intersectionObserver -> visible? -> add onScroll monitor
                          -> invisible? -> remove onScroll monitor
