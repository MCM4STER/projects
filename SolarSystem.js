const canvas = document.getElementById('canvas');
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext('2d');

const AU = 149.6e6 * 1000;
const G = 6.67428e-11;
const TIMESTEP = 3600 * 24;
let SCALE = 250 / AU;
let fps = 60;

let planets = [];

const sun_radius = 696340;
const mercury_radius = 2439.7;
const venus_radius = 6051.8;
const earth_radius = 6371;
const mars_radius = 3389.5;
const jupiter_radius = 69911;
const saturn_radius = 58232;
const uranus_radius = 25362;

ctx.fillStyle = "#212121";
ctx.fillRect(0, 0, width, height);

document.getElementById("scale").oninput = () => {
    SCALE = document.getElementById("scale").value / AU;
    document.getElementById("scale-output").textContent = document.getElementById("scale").value
}

class Planet {
    constructor(name, x, y, radius, color, mass) {
        this.name = name

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.mass = mass;

        this.star = false;
        this.distance = 0;
        this.orbit = [];

        this.x_vel = 0;
        this.y_vel = 0;
        this.draw_x = 0;
        this.draw_y = 0;

        this.last_x = this.x;
        this.last_y = this.y;
    }

    draw() {
        let x = this.x * SCALE + width / 2;
        let y = this.y * SCALE + height / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius * 1000 * SCALE, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    attraction(other) {
        let other_x = other.x;
        let other_y = other.y;

        let distance_x = other_x - this.x;
        let distance_y = other_y - this.y;

        let distance = Math.sqrt(distance_x ** 2 + distance_y ** 2);

        if (other.star) {
            this.distance = distance;
        }

        let force = G * this.mass * other.mass / distance ** 2;
        let theta = Math.atan2(distance_y, distance_x);
        let force_x = Math.cos(theta) * force;
        let force_y = Math.sin(theta) * force;
        return [force_x, force_y];
    }

    update_position(planets) {
        let total_fx, total_fy, fx, fy;
        total_fx = total_fy = 0;
        planets.forEach((planet) => {
            if (this == planet) { return }
            fx = this.attraction(planet)[0];
            fy = this.attraction(planet)[1];

            total_fx += fx;
            total_fy += fy;
        });
        this.x_vel += total_fx / this.mass * TIMESTEP;
        this.y_vel += total_fy / this.mass * TIMESTEP;

        this.x += this.x_vel * TIMESTEP;
        this.y += this.y_vel * TIMESTEP;

        this.orbit.push([this.x, this.y])
    }
}

function main() {
    const sun = new Planet("sun", 0, 0, sun_radius * 50, 'YELLOW', 1.98892 * 10 ** 30);//30
    sun.star = true;
    const earth = new Planet("earth", -1 * AU, 0, earth_radius * 500, 'BLUE', 5.9742 * 10 ** 24);//24
    earth.y_vel = 29.783 * 1000
    const mars = new Planet("mars", -1.524 * AU, 0, mars_radius * 500, 'RED', 6.39 * 10 ** 23);//23
    mars.y_vel = 24.077 * 1000
    const mercury = new Planet("mercury", 0.387 * AU, 0, mercury_radius * 500, 'GRAY', 3.30 * 10 ** 23);//23
    mercury.y_vel = -47.4 * 1000
    const venus = new Planet("venus", 0.723 * AU, 0, venus_radius * 500, 'WHITE', 4.8685 * 10 ** 24);//24
    venus.y_vel = -35.02 * 1000
    const jupiter = new Planet("jupiter", 5.1 * AU, 0, jupiter_radius * 500, 'orange', 1.89813 * 10 ** 27)//27
    jupiter.y_vel = 13.06 * 1000
    const saturn = new Planet("saturn", 9.5 * AU, 0, saturn_radius * 500, 'yellow', 568.32 * 10 ** 24)//24
    saturn.y_vel = 9.68 * 1000
    const uranus = new Planet("uranus", 19.8 * AU, 0, uranus_radius * 500, 'aqua', 86.811 * 10 ** 24)//24
    uranus.y_vel = 6.80 * 1000

    planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus];

    planets.forEach((planet) => {
        console.log(planet)
        document.getElementById("planet-options").innerHTML += "<div><p>" + planet.name + "</p>" + "<p id='" + planet.name + "-output'>" + planet.mass + "</p>" + '<input type="range" min="1" max="10" value="1" class="slider" id="' + planet.name + '-mass"></div>'
    })
}
let update_interval = setInterval(update, 1000 / fps)
document.getElementById("fps").oninput = () => {
    fps = document.getElementById("fps").value
    document.getElementById("fps-output").textContent = fps + " fps"
    clearInterval(update_interval)
    update_interval = setInterval(update, 1000 / fps);
}


function update() {
    console.log('Update')
    document.getElementById('timestamp').textContent = parseInt(document.getElementById('timestamp').textContent) + 1
    ctx.fillStyle = "rgba(21,21,21)";
    ctx.fillRect(0, 0, width, height);
    planets.forEach((planet) => {
        document.getElementById(planet.name + "-mass").oninput = () => {
            document.getElementById(planet.name + "-output").textContent *= document.getElementById(planet.name + "-mass").value;
            planet.mass *= document.getElementById(planet.name + "-mass").value;
        }
        planet.update_position(planets)
        planet.draw();
    })
}

main();