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
![alt text](<Screenshot 2026-10-31 181123.png>)

4. For Euler-Cromer at dt=1/20, the total energy readout is 192.542 J. For Euler at the same dt, the total energy readout is 207.699 J. And for Velocity Verlet at the same dt, the total energy readout is 203.788 J. I found that Euler-Cromer had the HUD total energy decrease with time, whereas the Euler total energy increased, and Velocity Verlet stayed the same throughout. These do not show very strong differences however (unless dt is large) because gravity is constant. If it was time dependent, then the method of integration has stronger input over the physics. 