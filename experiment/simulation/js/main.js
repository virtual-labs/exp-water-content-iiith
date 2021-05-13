'use strict';

document.addEventListener('DOMContentLoaded', function(){

	document.getElementById("output1").innerHTML = "Mass of container = ____ g";
	document.getElementById("output2").innerHTML = "Mass of wet soil = ____ g";
	document.getElementById("output3").innerHTML = "Mass of dry soil = ____ g";

	const playButton = document.getElementById('play');
	const pauseButton = document.getElementById('pause');
	const restartButton = document.getElementById('restart');
	const instrMsg = document.getElementById('procedure-message');
	const soilMenu = document.getElementById('soilMenu');

	pauseButton.addEventListener('click', function() { window.clearTimeout(tmHandle); });
	playButton.addEventListener('click', function() { window.clearTimeout(tmHandle); tmHandle = setTimeout(draw, 1000 / fps); });
	restartButton.addEventListener('click', function() {restart();});
	soilMenu.addEventListener('change', function() { window.clearTimeout(tmHandle); soilType = soilMenu.value; restart(); });

	function limCheck(obj, translate, lim, step)
	{
		if(obj.pos[0] === lim[0])
		{
			translate[0] = 0;
		}

		if(obj.pos[1] === lim[1])
		{
			translate[1] = 0;
		}

		if(translate[0] === 0 && translate[1] === 0)
		{
			if(step === 0)
			{
				document.getElementById("output1").innerHTML = "Mass of container = " + String(10) + "g";
			}

			else if(step === 1)
			{
				document.getElementById("output2").innerHTML = "Mass of wet soil = " + String(wetSoilMass) + "g";
			}

			else if(step === 4)
			{
				document.getElementById("output3").innerHTML = "Mass of dry soil = " + String(90) + "g";
			}

			return step + 1;
		}

		return step;
	};

	function updatePos(obj, translate, lim, step)
	{
		obj.pos[0] += translate[0];
		obj.pos[1] += translate[1];
	};

	class container {
		constructor(height, width, radius, x, y) {
			this.height = height;
			this.width = width;
			this.radius = radius;
			this.pos = [x, y];
		};

		draw(ctx) {
			ctx.fillStyle = "white";
			ctx.lineWidth = 3;

			if (this.width < 2 * this.radius) 
			{
				this.radius = this.width / 2;
			}

			if (this.height < 2 * this.radius) 
			{
				this.radius = this.height / 2;
			}

			ctx.beginPath();
			ctx.moveTo(this.pos[0] + this.radius, this.pos[1]);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1], this.pos[0] + this.width, this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1] + this.height, this.pos[0], this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0], this.pos[1] + this.height, this.pos[0], this.pos[1], this.radius);
			ctx.arcTo(this.pos[0], this.pos[1], this.pos[0] + this.width, this.pos[1], this.radius);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			const e1 = [this.pos[0] + this.width, this.pos[1]], e2 = [...this.pos];
			const gradX = (e1[0] - e2[0]) / -4, gradY = 10;

			ctx.beginPath();
			ctx.moveTo(e2[0], e2[1]);
			curvedArea(ctx, e2, -1 * gradX, -1 * gradY);
			curvedArea(ctx, e1, gradX, gradY);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};
	};

	class soil {
		constructor(height, width, radius, x, y) {
			this.height = height;
			this.width = width;
			this.radius = radius;
			this.pos = [x, y];
		};

		draw(ctx) {
			if (this.width < 2 * this.radius) 
			{
				this.radius = this.width / 2;
			}

			if (this.height < 2 * this.radius) 
			{
				this.radius = this.height / 2;
			}

			ctx.beginPath();
			ctx.fillStyle = colors[soilType];
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
	
			ctx.moveTo(this.pos[0] + this.radius, this.pos[1]);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1], this.pos[0] + this.width, this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1] + this.height, this.pos[0], this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0], this.pos[1] + this.height, this.pos[0], this.pos[1], this.radius);
			ctx.arcTo(this.pos[0], this.pos[1], this.pos[0] + this.width, this.pos[1], this.radius);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};

		heating(unit) {
			this.height -= unit;
		};
	};

	class weight{
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = '../images/weighing machine.png';
			this.img.onload = () => {ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);}; 
		};

		draw(ctx) {
			ctx.drawImage(objs['weight'].img, objs['weight'].pos[0], objs['weight'].pos[1], objs['weight'].width, objs['weight'].height);
		}
	};

	class oven {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
		};

		draw(ctx) {
			// Outline
			ctx.fillStyle = "white";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Lower division(red part)
			const divide = 0.80;
			ctx.fillStyle = "red";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0], this.pos[1] + divide * this.height, this.width, (1 - divide) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Main segment(pink part)
			const gap = 0.05;
			ctx.fillStyle = "pink";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0] + gap * this.width, this.pos[1] + gap * this.height, (1 - 2 * gap) * this.width, (divide - gap) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Horizontal rectangle at bottom
			const margin = [0.30, 0.05];
			ctx.fillStyle = "white";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0] + margin[0] * this.width, this.pos[1] + (margin[1] + divide) * this.height, (1 - 2 * margin[0]) * this.width, (1 - divide - 2 * margin[1]) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Horizontal rectangle at bottom
			const buttonGapX = 0.10;
			ctx.fillStyle = "white";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0] + buttonGapX * this.width, this.pos[1] + (margin[1] + divide) * this.height, (margin[0] - 2 * buttonGapX) * this.width, (1 - divide - 2 * margin[1]) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};
	};

	function init()
	{
		objs = {
			"weight": new weight(270, 240, 90, 300),
			"oven": new oven(330, 240, 520, 240),
			"container": new container(120, 150, 8, 600, 30),
			"soil": new soil(90, 150, 8, 90, 30),
		};
		keys = Object.keys(objs);

		step = 0;
		translate = [0, 0];
		lim = [-1, -1];
	};

	function restart() 
	{ 
		window.clearTimeout(tmHandle); 
		init();
		tmHandle = window.setTimeout(draw, 1000 / fps); 
	};

	const sliders = ["soilMass"];
	sliders.forEach(function(elem, ind) {
		const slider = document.getElementById(elem);
		const output = document.getElementById("demo_" + elem);
		output.innerHTML = slider.value; // Display the default slider value

		slider.oninput = function() {
			output.innerHTML = this.value;
			if(ind === 0)
			{
				wetSoilMass = this.value;
			}
			restart();
		};
	});

	function curvedArea(ctx, e, gradX, gradY)
	{
		ctx.bezierCurveTo(e[0], e[1] += gradY, e[0] += gradX, e[1] += gradY, e[0] += gradX, e[1]);
		ctx.bezierCurveTo(e[0] += gradX, e[1], e[0] += gradX, e[1] -= gradY, e[0], e[1] -= gradY);
	};

	function drawGraph(Xaxis, Yaxis, id, Xlabel, color) {
		try {
			// render the plot using plotly
			const trace1 = {
				x: Xaxis,
				y: Yaxis,
				type: 'scatter',
				mode: 'lines+markers',
				marker: {
					color: color
				}
			};

			const layout = {
				width: 450,
				height: 450,
				xaxis: {
					title: {
						text: Xlabel,
						font: {
							family: 'Courier New, monospace',
							size: 18,
							color: '#000000'
						}
					},
				},
				yaxis: {
					title: {
						text: 'Maximum Displacement',
						font: {
							family: 'Courier New, monospace',
							size: 18,
							color: '#000000'
						}
					}
				}
			};

			const config = {responsive: true};
			const data = [trace1];
			Plotly.newPlot(id, data, layout, config);
		}

		catch (err) {
			console.error(err);
			alert(err);
		}
	};

	const canvas = document.getElementById("main");
	canvas.width = 840;
	canvas.height = 600;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const fill = "#A9A9A9", border = "black", lineWidth = 1.5, fps = 15;
	const colors = {"Loam": "#654321", "Sand": "#754321", "Clay": "#854321"}, msgs = [
		"Click on the container to weigh it.",
		"Click on the wet soil to add it to the container and weigh it.",
		"Click on the container to move it to the oven for heating.",
		"Click on the soil to start the oven and heat the soil.",
		"Click on the container with dry soil to weigh it.",
	];

	canvas.addEventListener('click', function(event) { 
		if(translate[0] != 0 || translate[1] != 0)
		{
			return;
		}

		const canvasPos = [(canvas.width / canvas.offsetWidth) * (event.pageX - canvas.offsetLeft), (canvas.height / canvas.offsetHeight) * (event.pageY - canvas.offsetTop)];
		const errMargin = 10;

		keys.forEach(function(val, ind){
			if(canvasPos[0] >= objs[val].pos[0] - errMargin && canvasPos[0] <= objs[val].pos[0] + objs[val].width + errMargin && canvasPos[1] >= objs[val].pos[1] - errMargin && canvasPos[1] <= objs[val].pos[1] + objs[val].height + errMargin)
			{
				if(step === 0 && val === "container")
				{
					translate[0] = -5;
					translate[1] = 5;
					lim[0] = 135;
					lim[1] = 250;
				}

				else if(step === 1 && val === "soil")
				{
					translate[0] = 5;
					translate[1] = 5;
					lim[0] = 135;
					lim[1] = 280;
				}

				else if(step === 2 && val === "container")
				{
					translate[0] = 5;
					translate[1] = 5;
					lim[0] = 560;
					lim[1] = 350;
				}

				else if(step === 3 && val === "soil")
				{
					translate[1] = 1;
					lim[1] = 400;
				}

				else if(step === 4 && val === "container")
				{
					translate[0] = -5;
					translate[1] = -5;
					lim[0] = 135;
					lim[1] = 250;
				}
			}
		});
	});

	let step, translate, lim, objs, keys;
	init();

	// Input Parameters 
	let wetSoilMass = 100, soilType = "Loam";

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height); 
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		keys.forEach(function(val, ind){
			objs[val].draw(ctx);
		});

		if(translate[0] != 0 || translate[1] != 0)
		{
			let temp = step;

			if(step != 0)
			{
				updatePos(objs['soil'], translate, lim, step);
				if(step === 3)
				{
					objs['soil'].heating(translate[1]);
				}

				if(step === 1 || step === 3)
				{
					temp = limCheck(objs['soil'], translate, lim, step);
				}
			}

			if(step != 1 && step != 3)
			{
				updatePos(objs['container'], translate, lim, step);
				temp = limCheck(objs['container'], translate, lim, step);
			}

			step = temp;
		}

		if(step === 5)
		{
			restart();
		}

		document.getElementById("procedure-message").innerHTML = msgs[step];
		tmHandle = window.setTimeout(draw, 1000 / fps);
	};

	let tmHandle = window.setTimeout(draw, 1000 / fps);
});
