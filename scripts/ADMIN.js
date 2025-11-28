



function charter() {

var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title: {
		text: "Platform Traffic Analytics - Overview"
	},
	data: [{
		type: "pie",
		startAngle: 240,
		yValueFormatString: "##0.00'%'",
		indexLabel: "{label} {y}",
		dataPoints: [
			{y: 25.0, label: "New Visitors"},
			{y: 75.0, label: "Registered Users"},
			{y: 20.0, label: "Total Users"},
			{y: 40, label: "Total User Engagements"},
			{y: 35, label: "Others"}
		]
	}]
});
chart.render();

}

charter();