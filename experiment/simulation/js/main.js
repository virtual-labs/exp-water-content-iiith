'use strict';

document.addEventListener('DOMContentLoaded', function(){

	const playButton = document.getElementById('play');
	const pauseButton = document.getElementById('pause');
	const restartButton = document.getElementById('restart');

	pauseButton.addEventListener('click', function() { window.clearTimeout(tmHandle); });
	playButton.addEventListener('click', function() { window.clearTimeout(tmHandle); tmHandle = setTimeout(draw, 1000 / fps); });
	restartButton.addEventListener('click', function() {restart();});

	function init()
	{
	}

	function restart() 
	{ 
		window.clearTimeout(tmHandle); 
		init();
		tmHandle = window.setTimeout(draw, 1000 / fps); 
	}

	const sliders = ["slider"];
	sliders.forEach(function(elem, ind) {
		const slider = document.getElementById(elem);
		const output = document.getElementById("demo_" + elem);
		output.innerHTML = slider.value; // Display the default slider value

		slider.oninput = function() {
			output.innerHTML = this.value;
			restart();
		};
	});

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
	}

	const canvas = document.getElementById("main");
	canvas.width = 1200;
	canvas.height = 600;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const fill = "#A9A9A9", border = "black", lineWidth = 1.5, fps = 15;

	// Input Parameters 
	init();

	//function drawGround(ctx, ground)
	//{
		//ctx.save();
		//ctx.fillStyle = "pink";
		//ctx.beginPath();
		//ctx.moveTo(ground[0][0], ground[0][1]);

		//ground.forEach(function(g, index){
			//const next = (index + 1) % ground.length;
			//ctx.lineTo(ground[next][0], ground[next][1]);
		//});
		//ctx.closePath();
		//ctx.fill();
		//ctx.stroke();
		//ctx.restore();
	//}

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = fill;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		//drawGround(ctx, ground);

		ctx.beginPath();
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		tmHandle = window.setTimeout(draw, 1000 / fps);
	}

	let tmHandle = window.setTimeout(draw, 1000 / fps);
})
