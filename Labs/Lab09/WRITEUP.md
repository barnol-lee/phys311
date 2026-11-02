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
![alt text](<Screenshot 2026-11-02 063514.png>)
For my scene I chose a large number of balls connected by springs in a series, where the first and final balls (which are the black ones in the image) are static. The balls are also stuck in a box. The easier diagnostic here was momentum conservation, as it conserved regardless of what you choose for your restitution. The work is mostly just about keeping track of the momentum fed into the static objects in your environment and properly feeding that back into the total momentum property in World. Though, keeping it truly stable over time was quite a hassle of debugging. Although I tried and tried to get energy conserved when e=1, I could not get it to work. The best I could manage was a drift of about 0.05%/sec. 

6. Performance Benchmark On Scene 1:
N=20: tPhysics=0.000ms, tRender=0.000ms, fps=165
N=50: tPhysics=0.000ms, tRender=0.000ms, fps=165
N=100: tPhysics=0.000ms, tRender=0.000ms, fps=165
N=200: tPhysics=1.000ms, tRender=0.000ms, fps=165
N=400: tPhysics=3.000ms, tRender=0.000ms, fps=165
N=500: tPhysics=5.000ms, tRender=0.000ms, fps=165
N=600: tPhysics=350.000ms, tRender=1.000ms, fps=5
The physics compute time grew the fastest in line with prediction. The place to optimize here is collision resolution, as that is really where the computations start to explode in complexity. Although it seems like there's a lot of room to test N=500 to N=600, my simulation pretty much performs as bad at N=510 as it does at N=600. So, N=500 really is about the best I can get.

7. Performance Benchmark Implementing The Grid On Scene 1:
Since my simulation ran N=200 very well, I will just show a before and after picking up from N=500 and moving up with a cell size of 5. The entries are of the form (tPhysics, tRender, fps).
N       Before:               After: 
500     (5ms, 0ms, 165)       (1ms, 0ms, 165)
600     (350ms, 1ms, 5)       (2ms, 0ms, 165)
In each case, it is seen momentum is conserved perfectly.



