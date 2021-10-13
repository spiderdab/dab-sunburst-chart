import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as p5 from 'p5';
import jsonChartData from '../../assets/data.json';

@Component({
  selector: 'app-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrls: ['./sunburst.component.css']
})

export class SunburstComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    var objectNumber = jsonChartData.objects.length;
    let myp5 = new p5(p => {
      let x = p.windowWidth/2;
      let y = p.windowHeight/2;
      let d = (x>y) ? p.windowHeight/1.3 : p.windowWidth/1.3;
      let r = d/2;
      let nLines = 4;
      let sectionRadians = p.TWO_PI / objectNumber;
      let backgroundColor = p.color('#29333c');
      let lineColor = p.color('#6a6d76');
      let pieStrokeColor = p.color(240);
      let blankRadiusX = 14;
      let blankRadiusY = 9;
      let blankRadius2X = 2 * blankRadiusX;
      let blankRadius2Y = 2 * blankRadiusY;
      let sum = 0;
      let maxValue = 0;
      let zeroDiameter = 80;
      let zeroRadius = zeroDiameter/2;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent('p5Canvas');
        p.pixelDensity(1.0);
        p.smooth();
        p.frameRate(10);
      };

      p.draw = () => {
        p.background(backgroundColor);
        p.fillPie();
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        x = p.windowWidth/2;
        y = p.windowHeight/2;
        d = d = (x>y) ? p.windowHeight/1.3 : p.windowWidth/1.3;
        r = d/2;
        sectionRadians = p.TWO_PI / objectNumber;
      };

      p.mouseClicked = () => {
      };

      p.fillPie = () => {
        p.noFill();
        p.textSize(9);
        
        /* Calculate max value */
        for (var i = 0; i < objectNumber; i++) {
          for (var k = 0; k < jsonChartData.objects[i].values.length; k++) {
            sum += jsonChartData.objects[i].values[k];
          }
          if (sum > maxValue) {
            maxValue = sum;
          }
          sum = 0;
        }

        /* Draw Pie Slices*/
        for (var i = 0; i < objectNumber; i++) {
          /* Radial lines */
          p.noFill();
          p.stroke(lineColor);
          p.line(x,y, x+(r+zeroRadius)*p.cos(sectionRadians*i-p.HALF_PI), y+(r+zeroRadius)*p.sin(sectionRadians*i-p.HALF_PI));
          /* Arc texts */
          p.stroke(pieStrokeColor);
          //p.strokeWeight(0.5);
          p.arcText(jsonChartData.objects[i].date, x, y, sectionRadians*i+sectionRadians/2, -(r+zeroRadius+10));
          //p.strokeWeight(1.0);
          /* Coloured arcs */
          for (var k = jsonChartData.objects[i].values.length - 1; k >= 0; k--) {
            var pieRadius = jsonChartData.objects[i].values[k];
            for (var j = k - 1; j >= 0; j--) {
              pieRadius += jsonChartData.objects[i].values[j];
            }
            pieRadius = d * pieRadius / maxValue;
            pieRadius += zeroDiameter;
            var pieBegin = sectionRadians * i - p.HALF_PI;
            p.fill(100 + k*50, 105 + k*20, 220 - k*30);
            p.stroke(pieStrokeColor);
            p.arc(x, y, pieRadius, pieRadius, pieBegin, pieBegin + sectionRadians, p.PIE);
          }
        }

        /* Scheme */
        for (var i = 0; i < nLines; i++) {
          /* Circles: */
          p.noFill();
          p.stroke(lineColor);
          p.circle(x,y,d/(nLines/(i+1))+zeroDiameter);
          /* Labels: */
          p.fill(backgroundColor);
          p.rect(x-blankRadiusX, (y-r/(nLines/(i+1)))-zeroRadius-blankRadiusY, blankRadius2X, blankRadius2Y, 5);
          //p.circle(x, y-r, blankRadius);
          /* Values text */
          p.noFill();
          p.stroke(pieStrokeColor);
          p.text(p.int(maxValue/(nLines/(i+1))), x, y-r/(nLines/(i+1))-zeroRadius+1);
        }
        /* Zero Circle */
        p.stroke(pieStrokeColor);
        p.fill(backgroundColor)
        p.circle(x,y,zeroDiameter);
        /* Zero Label */
        p.stroke(lineColor);
        p.fill(backgroundColor);
        p.rect(x-blankRadiusX, y-zeroRadius-blankRadiusY, blankRadius2X, blankRadius2Y, 5);
        /* Zero text */
        p.noFill();
        p.stroke(pieStrokeColor);
        p.text(0, x, y-zeroRadius+1);
      };

      p.arcText = (txt: string, centerX: number, centerY:number, rotation: number, radius: number) => {
        p.textAlign(p.CENTER, p.CENTER);
        p.push();
        p.translate(centerX, centerY);
        if (rotation > p.HALF_PI && rotation < (p.PI + p.HALF_PI)) {
          radius = -radius;
          rotation += p.PI;
        }
        p.rotate(rotation);        

        /* Calculate center */
        for (var i=0; i<txt.length/2; i++) {
          var opposite = p.textWidth(txt.charAt(i));
          p.rotate(p.atan(opposite/radius));
        }
        
        /* Draw text */
        for (var i=0; i<txt.length; i++) {
          var letter = txt.charAt(i);
          opposite = p.textWidth(letter)/2;
          p.rotate(-p.atan(opposite/radius));
          p.text(letter, 0, radius);
          p.rotate(-p.atan(opposite/radius));
        }    
        p.pop();
      };

      p.setLines = (n: number) => {
        nLines = n;
      };
    }, this.el.nativeElement);
  }
}
