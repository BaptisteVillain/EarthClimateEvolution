var graph 	              = {};
graph.svg                 = document.querySelector('.container-graph svg');
graph.line                = [];
graph.year_display        = document.querySelector('.year-display');
graph.timeline_container  = document.querySelector('.container-timeline .timeline');
graph.timeline_svg        = document.querySelector('.container-timeline svg');
graph.timeline_link       = [];
graph.timeline_scrollbar  = document.querySelector('.container-timeline .scroll-bar');
graph.timeline_link_last  = undefined;
graph.detailed_container  = document.querySelector('.container-detailed-graph');
graph.detailed_svg        = document.querySelector('.container-detailed-graph svg');
graph.detailed_month_pins = [];


function svgInit(){
	var parent = graph.svg.parentNode.getBoundingClientRect();
	graph.svg.setAttribute('viewBox', '0 0 ' + parent.width + ' ' + parent.height);
	graph.svg.setAttribute('width',  parent.width);
	graph.svg.setAttribute('height', parent.height);

	graph.width  = graph.svg.getBoundingClientRect().width;
	graph.height = graph.svg.getBoundingClientRect().height;
	graph.multi  = graph.width/8.5;

}

svgInit();

// INIT DATA
var sums = [];
var values = [];

for (var i = 0; i < data.length; i++) {
	for (var j = data[i].values.length - 1; j >= 0; j--) {
		values[values.length] = data[i].values[j]
	}
	sums[sums.length] = data[i].sum;
}

var values_min = Math.min.apply(Math, values);
var values_max = Math.max.apply(Math, values);

console.log(values_min);


var min = Math.min.apply(Math, sums);
var max = Math.max.apply(Math, sums) + Math.abs(min);


class line{
	constructor(i){
		this.values = data[i].values;
		this.node;
		this.year = data[i].year;
		this.sum = data[i].sum;
		this.index = i;
	}
	drawPolygon(){
		var path = 'M';
		var x;
		var y;
		for (var i = 0; i < 12 ; i++) {
			if(this.values[i] != undefined){
				if(i == 0){
					x = this.values[i]*graph.multi*-1*0.75;
					y = this.values[i]*graph.multi*0;
				}
				else if(i == 1){
					x = this.values[i]*graph.multi*-1*.63;
					y = this.values[i]*graph.multi*-1*0.37;
					path += ' L';
				}
				else if(i == 2){
					x = this.values[i]*graph.multi*-1*0.37;
					y = this.values[i]*graph.multi*-1*0.63;
					path += ' L';
				}
				else if(i == 3){
					x = this.values[i]*graph.multi*0;
					y = this.values[i]*graph.multi*-1*0.75;
					path += ' L';
				}
				else if(i == 4){
					x = this.values[i]*graph.multi*0.37;
					y = this.values[i]*graph.multi*-1*0.63;
					path += ' L';
				}
				else if(i == 5){
					x = this.values[i]*graph.multi*0.63;
					y = this.values[i]*graph.multi*-1*0.37;
					path += ' L';
				}
				else if(i == 6){
					x = this.values[i]*graph.multi*0.75;
					y = this.values[i]*graph.multi*0;
					path += ' L';
				}
				else if(i == 7){
					x = this.values[i]*graph.multi*0.63;
					y = this.values[i]*graph.multi*0.37;
					path += ' L';
				}
				else if(i == 8){
					x = this.values[i]*graph.multi*0.37;
					y = this.values[i]*graph.multi*0.63;
					path += ' L';
				}
				else if(i == 9){
					x = this.values[i]*graph.multi*0;
					y = this.values[i]*graph.multi*0.75;
					path += ' L';
				}
				else if(i == 10){
					x = this.values[i]*graph.multi*-1*0.37;
					y = this.values[i]*graph.multi*0.63;
					path += ' L';
				}
				else if(i == 11){
					x = this.values[i]*graph.multi*-1*0.63;
					y = this.values[i]*graph.multi*0.37;
					path += ' L';
				}
				path += ((graph.width/2 + (graph.width/6)*Math.cos(i * 2 * Math.PI / 12)) - x )+ ' ' + ((graph.height/2 + (graph.width/6)*Math.sin(i * 2 * Math.PI / 12)) - y);
			}
		}
		if(this.year != data[data.length-1].year){
			path += ' Z';
		}
		this.node = document.createElementNS('http://www.w3.org/2000/svg',"path");
		this.node.setAttributeNS(null, 'd', path);


		var hue = 220 - (((this.sum + Math.abs(min))/max)*220);

		this.node.setAttributeNS(null, 'style', 'stroke: hsl(' + hue + ', 100%, 30%)');
		this.node.classList.add('line-year')

		graph.svg.appendChild(this.node);

	}
	onClick(){
		var that = this;
		this.node.addEventListener('click',function(){
			var width = graph.timeline_container.offsetWidth/21;
			width = width > 50 ? width : 50;
			graph.timeline_container.scrollLeft = (that.index * width);
			var ratio = graph.timeline_container.scrollLeft / (graph.timeline_svg.getAttribute('width') - graph.timeline_container.offsetWidth);
			graph.timeline_scrollbar.style.transform = 'scaleX('+ ratio +')';
			graph.timeline_link[that.index].click();
		});
	}
}


function framework(){
	graph.g_line = document.createElementNS('http://www.w3.org/2000/svg',"g");
	graph.g_line.classList.add('framework-line');
	var path = 'M' + ((graph.width/2 + (graph.width/2.5)*Math.cos(0)))+ ' ' + ((graph.height/2 + (graph.width/2.5)*Math.sin(0)));

	for (var i = 0; i < 12 ; i++) {
		path += ' L' + ((graph.width/2 + (graph.width/2.5)*Math.cos(i * 2 * Math.PI / 12)))+ ' ' + ((graph.height/2 + (graph.width/2.5)*Math.sin(i * 2 * Math.PI / 12)));
		
		var newline = document.createElementNS('http://www.w3.org/2000/svg',"path");
		var newpath  = 'M' + graph.width/2 + ' ' + graph.height/2;
		newpath  += ' L' + ((graph.width/2 + (graph.width/2.5)*Math.cos(i * 2 * Math.PI / 12)))+ ' ' + ((graph.height/2 + (graph.width/2.5)*Math.sin(i * 2 * Math.PI / 12)));
		newline.setAttributeNS(null, 'd', newpath);

		graph.g_line.appendChild(newline);
	}

	graph.svg.appendChild(graph.g_line);

	path += ' Z';
	var node = document.createElementNS('http://www.w3.org/2000/svg',"path");
	node.classList.add('framework');
	node.setAttributeNS(null, 'd', path);
	graph.svg.appendChild(node);
}
framework();


function frameworkText(){
	graph.g_text = document.createElementNS('http://www.w3.org/2000/svg',"g");
	graph.g_text.classList.add('framework-text');
	graph.svg.appendChild(graph.g_text);
	for (var i = 0; i < 12 ; i++) {
		var newText = document.createElementNS('http://www.w3.org/2000/svg',"text");

		i == 0 ? newText.textContent = 'jan' : '';
		i == 1 ? newText.textContent = 'feb' : '';
		i == 2 ? newText.textContent = 'mar' : '';
		i == 3 ? newText.textContent = 'apr' : '';
		i == 4 ? newText.textContent = 'may' : '';
		i == 5 ? newText.textContent = 'jun' : '';
		i == 6 ? newText.textContent = 'jul' : '';
		i == 7 ? newText.textContent = 'aug' : '';
		i == 8 ? newText.textContent = 'sep' : '';
		i == 9 ? newText.textContent = 'oct' : '';
		i == 10 ? newText.textContent = 'nov' : '';
		i == 11 ? newText.textContent = 'dec' : '';

		newText.setAttributeNS(null, 'x', ((graph.width/2 + (graph.width/2.45)*Math.cos(i * 2 * Math.PI / 12))));
		newText.setAttributeNS(null, 'y', ((graph.width/2 + (graph.width/2.45)*Math.sin(i * 2 * Math.PI / 12))));
		newText.setAttributeNS(null, 'transform', 'rotate('+ (90+(i*30)) +','+ ((graph.width/2 + (graph.width/2.45)*Math.cos(i * 2 * Math.PI / 12))) +','+ ((graph.width/2 + (graph.width/2.45)*Math.sin(i * 2 * Math.PI / 12))) +')');

		graph.g_text.appendChild(newText);
	}
}
frameworkText();

function frameworkPreventLine(prevent){
	var path = 'M';
	var x;
	var y;
	for (var i = 0; i < 12 ; i++) {
		if(i == 0){
			x = prevent*graph.multi*-1*0.75;
			y = prevent*graph.multi*0;
		}
		else if(i == 1){
			x = prevent*graph.multi*-1*.63;
			y = prevent*graph.multi*-1*0.37;
			path += ' L';
		}
		else if(i == 2){
			x = prevent*graph.multi*-1*0.37;
			y = prevent*graph.multi*-1*0.63;
			path += ' L';
		}
		else if(i == 3){
			x = prevent*graph.multi*0;
			y = prevent*graph.multi*-1*0.75;
			path += ' L';
		}
		else if(i == 4){
			x = prevent*graph.multi*0.37;
			y = prevent*graph.multi*-1*0.63;
			path += ' L';
		}
		else if(i == 5){
			x = prevent*graph.multi*0.63;
			y = prevent*graph.multi*-1*0.37;
			path += ' L';
		}
		else if(i == 6){
			x = prevent*graph.multi*0.75;
			y = prevent*graph.multi*0;
			path += ' L';
		}
		else if(i == 7){
			x = prevent*graph.multi*0.63;
			y = prevent*graph.multi*0.37;
			path += ' L';
		}
		else if(i == 8){
			x = prevent*graph.multi*0.37;
			y = prevent*graph.multi*0.63;
			path += ' L';
		}
		else if(i == 9){
			x = prevent*graph.multi*0;
			y = prevent*graph.multi*0.75;
			path += ' L';
		}
		else if(i == 10){
			x = prevent*graph.multi*-1*0.37;
			y = prevent*graph.multi*0.63;
			path += ' L';
		}
		else if(i == 11){
			x = prevent*graph.multi*-1*0.63;
			y = prevent*graph.multi*0.37;
			path += ' L';
		}
		path += ((graph.width/2 + (graph.width/6)*Math.cos(i * 2 * Math.PI / 12)) - x )+ ' ' + ((graph.height/2 + (graph.width/6)*Math.sin(i * 2 * Math.PI / 12)) - y);
	}
	path += ' Z';

	var node = document.createElementNS('http://www.w3.org/2000/svg',"path");
	node.classList.add('line-prevent');
	node.setAttributeNS(null, 'd', path);
	graph.svg.appendChild(node);

	var text = document.createElementNS('http://www.w3.org/2000/svg',"text");
	text.textContent = '+' + prevent.toFixed(1) + '°C';
	text.setAttributeNS(null, 'x', ((graph.width/2 + (graph.width/5.8)*Math.cos(0)) - prevent*graph.multi*-1*0.75));
	text.setAttributeNS(null, 'y', ((graph.width/2 + (graph.width/5.8)*Math.sin(0))));
	text.setAttributeNS(null, 'transform', 'rotate(90,'+ ((graph.width/2 + (graph.width/5.8)*Math.cos(0)) - prevent*graph.multi*-1*0.75) +','+ ((graph.height/2 + (graph.width/5.8)*Math.sin(0))) +')');
	text.classList.add('text-prevent');
	graph.svg.appendChild(text);
}


frameworkPreventLine(1.5);
frameworkPreventLine(2.0);

function loop(i){
	if (i == data.length-1) {
		return false;
	}
	else{
		graph.line[graph.line.length] = new line(i);
		graph.line[graph.line.length-1].drawPolygon();
		graph.line[graph.line.length-1].onClick();
		graph.year_display.textContent = data[i].year;
		setTimeout(function(){
			loop(i+1);
		}, 100);
	}
}
loop(0);

function initTimeline(){
	var width = graph.timeline_container.offsetWidth/21;
	width = width > 50 ? width : 50;
	graph.timeline_svg.setAttribute('viewBox', '0 0 ' + (width*(data.length-1)) + ' 100');
	graph.timeline_svg.setAttribute('width',  width*(data.length-1));
	graph.timeline_svg.setAttribute('height',  '100');
	var node_path = document.createElementNS('http://www.w3.org/2000/svg',"path");
	var path = '';
	for (var i = 0; i < data.length-1; i++) {
		if(i == 0){
			path += 'M' + ((i * width) + width/2) + ' ' + (40 - (data[i].sum+min)*28);
		}
		else{
			path += ' L' + ((i * width) + width/2) + ' ' + (40 - (data[i].sum+min)*28);
		}

		var link = document.createElement('button');
		//link.href= '#';
		link.className = 'timeline-item';
		link.style.transform = 'translate('+ ((i * width) + width/2) +'px,'+ (40 - (data[i].sum+min)*28) +'px)';

		var content = document.createElement('span');
		content.innerHTML = data[i].year;
		link.appendChild(content);

		graph.timeline_container.appendChild(link);
		graph.timeline_link[graph.timeline_link.length] = link;


	}
	node_path.setAttribute('d', path);
	graph.timeline_svg.appendChild(node_path);

	var line_zero = document.createElementNS('http://www.w3.org/2000/svg',"path");
	line_zero.setAttribute('d', 'M0 40 L' + (width*data.length-1) + ' 40');
	line_zero.classList.add('line-zero');
	graph.timeline_svg.appendChild(line_zero);
	var text_zero = document.createElementNS('http://www.w3.org/2000/svg',"text");
	text_zero.setAttribute('x',  5);
	text_zero.setAttribute('y',  35);
	text_zero.textContent = 0 + '°C';
	graph.timeline_svg.appendChild(text_zero);
}

initTimeline();

graph.timeline_container.addEventListener('wheel', function(e){
	graph.timeline_container.scrollLeft += e.deltaY;
	graph.timeline_container.scrollLeft += e.deltaX;
	var ratio = graph.timeline_container.scrollLeft / (graph.timeline_svg.getAttribute('width') - graph.timeline_container.offsetWidth);
	graph.timeline_scrollbar.style.transform = 'scaleX('+ ratio +')';
});

//DISABLE TOUCHPAD HISTORY CONTROLS
document.addEventListener('wheel', function(e){
	e.preventDefault();
});

for (var i = graph.timeline_link.length - 1; i >= 0; i--) {
	graph.timeline_link[i].addEventListener('click', function(){
		this.classList.toggle('active');
		graph.svg.parentNode.classList.add('reduce');
		graph.detailed_container.classList.add('active');

		if(graph.timeline_link_last != undefined && graph.timeline_link_last != this){
			graph.timeline_link_last.classList.remove('active');
		}
		if(graph.timeline_link_last != this){
			graph.timeline_link_last = this;
		}
		else{
			graph.timeline_link_last = undefined;
			graph.svg.parentNode.classList.remove('reduce');
			graph.detailed_container.classList.remove('active');
		}

		if(this.classList.contains('active')){
			svgSpecificUpdate(this);
		}

	});
}

function svgSpecificsInit(){
	graph.detailed_container.offsetWidth;
	graph.detailed_svg.setAttribute('viewBox', '0 0 ' + graph.detailed_container.offsetWidth + ' ' + graph.detailed_container.offsetHeight);
	graph.detailed_svg.setAttribute('width',  graph.detailed_container.offsetWidth);
	graph.detailed_svg.setAttribute('height', graph.detailed_container.offsetHeight);

	var el_width  = graph.detailed_container.offsetWidth/12;
	var el_height = graph.detailed_container.offsetHeight/2;

	var el_node = document.createElementNS('http://www.w3.org/2000/svg',"path");
	var el_path = '';

	for (var i = 0; i < 12; i++) {
		var el = document.createElement('div');
		el.className = 'month-pin';
		el.style.transform = 'translate('+ (el_width/2 + (i*el_width)) + 'px, '+ (el_height) +'px)'
		graph.detailed_month_pins[i] = el;
		graph.detailed_container.appendChild(el);
		el_path += i == 0 ? 'M' + (el_width/2 + (i*el_width)) + ' ' + (el_height) : ' L' + (el_width/2 + (i*el_width)) + ' ' + (el_height);
	}

	el_node.setAttributeNS(null, 'd', el_path);
	graph.detail_svg_path = el_node;
	graph.detailed_svg.appendChild(el_node);

}

svgSpecificsInit();


function svgSpecificUpdate(el){
	var index = graph.timeline_link.indexOf(el);
	var el_width  = graph.detailed_container.offsetWidth/12;
	var el_height = graph.detailed_container.offsetHeight/2;
	var el_path = '';
	for (var i = 0; i < 12; i++) {
		graph.detailed_month_pins[i].style.transform = 'translate('+ (el_width/2 + (i*el_width)) + 'px, '+ (el_height - data[index].values[i]*42) +'px)';
		el_path += i == 0 ? 'M' + (el_width/2 + (i*el_width)) + ' ' + (el_height - data[index].values[i]*42) : ' L' + (el_width/2 + (i*el_width)) + ' ' + (el_height - data[index].values[i]*42);


		var hue = 220 - ((parseFloat(data[index].values[i])+Math.abs(values_min))/(values_max+Math.abs(values_min)))*220;
		
		graph.detailed_month_pins[i].style.backgroundColor = 'hsl(' + hue + ', 100%, 30%)';
		graph.detailed_month_pins[i].innerHTML = data[index].values[i] >= 0 ? '<p>+'+  data[index].values[i] +'</p>' : '<p>'+  data[index].values[i] +'</p>';
	}
	graph.detail_svg_path.setAttributeNS(null, 'd', el_path);
	graph.year_display.textContent = data[index].year;
}


setTimeout(function(){
	graph.timeline_container.style.transform = 'translateY(0px)';
}, (data.length)*100);

