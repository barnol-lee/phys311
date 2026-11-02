1. Jitter-Bug Demonstration:
![alt text](<Screenshot 2026-11-01 203746.png>)
The relevant line of code in resolving collisions protects against this by forcing the code collision function to return true when the relative velocity of the two bodies are positive (moving apart), while going ahead with the resolution when the relative velocity is negative (moving together). If it is removed, there are special circumstances that allow the collision code to run even while they are separating, reversing their velocities back and forth in a loop, causing the jitter bug. So, by forcing the function to return true, this whole process is avoided. In my screenshot, the smoking gun for this sort of bug is the fact that energy has grown enormously, even more than there was to begin with (110%).

