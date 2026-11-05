1. The following values are the final ones recorded from the simulation with identical ending times of 3.117 seconds 

Qua            PYTHON          JAVASCRIPT          DIFFERENCE
x (m)          40.067          40.067              0.000
y (m)          -0.023          -0.023              0.000
vx (m/s)       12.856          12.856              0.000
vy (m/s)       -15.254         -15.254             0.000
E_tot (J)      198.750         198.750             0.000

2. Screenshot of Vec2 test:
![alt text](<Screenshot 2026-10-25 195023.png>)

3. Screenshot of the simulation:
![alt text](<Screenshot 2026-11-04 184619.png>)

INTEGRATOR COMPARISON
4. For Euler-Cromer at dt=1/20, the total energy readout is 192.542 J. For Euler at the same dt, the total energy readout is 207.699 J. And for Velocity Verlet at the same dt, the total energy readout is 203.788 J. I found that Euler-Cromer had the HUD total energy decrease with time, whereas the Euler total energy increased, and Velocity Verlet stayed the same throughout. These do not show very strong differences however (unless dt is large) because gravity is constant. If it was time dependent, then the method of integration has stronger input over the physics. 

FIXED TIMESTEP DEMONSTRATION
5. When integrating per fixed timestep, the sim gets the results above, and when switching tabs, the sim pauses and runs again like normal. But when integrating per frametime, the sim has an increased time of flight of 3.121 s and range of 40.125 m. But if you go ahead switch tabs back and forth, the sim has these values reduced to (e.g.) 3.078 s and 39.572 m respectively (because the value now depends on lag, those values won't be the same every time.)
Fixed timestep: This screenshot is the same as the one from (3).
No fixed timestep: ![alt text](<Screenshot 2026-11-04 184948.png>)
Interesting note about this specific screenshot: by inducing lag at the right time, I allowed the projectile to actually phase through the ground, causing energy and velocity to increase beyond what it ought to.


6. The hardest thing to port was not the physics or math per se, but rather dealing with the animation and HTML portion, which I am deeply unfamiliar. The rendering counfounded me multiple times. So, really it was things like the camera that took the most time for me to understand, which had to be implemented into the simulation so that it looked right.

