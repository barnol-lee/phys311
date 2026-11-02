1. Jitter-Bug Demonstration:
![alt text](<Screenshot 2026-11-01 203746.png>)
The relevant line of code in resolving collisions protects against this by forcing the code collision function to return true when the relative velocity of the two bodies are positive (moving apart), while going ahead with the resolution when the relative velocity is negative (moving together). If it is removed, there are special circumstances that allow the collision code to run even while they are separating, reversing their velocities back and forth in a loop, causing the jitter bug. So, by forcing the function to return true, this whole process is avoided. In my screenshot, the smoking gun for this sort of bug is the fact that energy has grown enormously, even more than there was to begin with (110%).

2. Conservation HUD:
For e=1.0:
![alt text](<Screenshot 2026-11-01 230153.png>)
For e=0.8
![alt text](<Screenshot 2026-11-01 230425.png>)
As a note, for these two simulations, I randomized position and velocity, so that is why the numbers are different. The reason energy decreases monotonically while momentum remains conserved as we go from a restituiton of 1.0 to 0.8 is that while momentum is transferred into the box (or whatever boundary), the energy changes its form. That is, the momentum is the same quantity regardless of to what it is attributed, whereas energy will turn from kinetic energy into thermal energy or chemical into kinetic, which requires a change in equations. 

3. Scene 1:
![alt text](<Screenshot 2026-11-01 234220.png>)

4. Scene 2:
![alt text](<Screenshot 2026-11-02 062749.png>)

5. Scene 3:
