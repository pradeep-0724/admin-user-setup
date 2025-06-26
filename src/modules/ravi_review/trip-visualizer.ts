import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface TripSegment {
  from: string;
  to: string;
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  path: string;
  showArrow: boolean;
  labelX: number;
  labelY: number;
}
@Component({
  selector: 'app-trip-visualizer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trip-visualizer.html',
  styleUrl: './trip-visualizer.scss',
})
export class TripVisualizerComponent {
  newFrom = '';
  newTo = '';
  trips: TripSegment[] = [];

  private colors = ['#6A0DAD', '#1E90FF', '#FFA500', '#FF69B4'];
  private colorIndex = 0;
  private currentX = 50;
  private currentY = 200;
  private segmentLength = 100;

  addTrip(): void {
    const from = this.newFrom.trim().toUpperCase().slice(0, 3);
    const to = this.newTo.trim().toUpperCase().slice(0, 3);
    if (!from || !to) return;

    const lastTrip = this.trips[this.trips.length - 1];
    const isSameAsLast = lastTrip?.from === from && lastTrip?.to === to;
    const isContinuation = lastTrip?.to === from;
    const isDisconnected = lastTrip && lastTrip.to !== from;
    const isRepeated = this.trips.some((t) => t.from === from && t.to === to);

    let color = this.getColor(isSameAsLast, isRepeated, isContinuation);
    const { x1, y1, x2, y2, path, showArrow } = this.calculatePath(
      lastTrip,
      isContinuation,
      isSameAsLast,
      isRepeated,
      isDisconnected
    );

    const labelX = (x1 + x2) / 2;
    const labelY = (y1 + y2) / 2 - 10;

    this.trips.push({
      from,
      to,
      color,
      x1,
      y1,
      x2,
      y2,
      path,
      showArrow,
      labelX,
      labelY,
    });

    this.newFrom = '';
    this.newTo = '';
  }

  private getColor(
    isSameAsLast: boolean,
    isRepeated: boolean,
    isContinuation: boolean
  ): string {
    if (isRepeated) return '#FFA500';
    if (isSameAsLast) return '#ccc';
    if (!isContinuation) this.colorIndex++;
    return this.colors[this.colorIndex % this.colors.length];
  }

  private calculatePath(
    lastTrip: TripSegment | undefined,
    isContinuation: boolean,
    isSameAsLast: boolean,
    isRepeated: boolean,
    isDisconnected: boolean
  ) {
    let x1 = this.currentX;
    let y1 = this.currentY;
    let x2 = x1 + this.segmentLength;
    let y2 = y1;
    let path = '';
    let showArrow = false;

    if (!lastTrip) {
      // First trip
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (isContinuation) {
      // Continuation of the previous trip
      x1 = lastTrip.x2;
      y1 = lastTrip.y2;
      x2 = x1 + this.segmentLength;
      y2 = y1;
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (isSameAsLast || isRepeated) {
      // Repeated route
      x1 = lastTrip.x2;
      y1 = lastTrip.y2;
      x2 = x1 + this.segmentLength;
      y2 = y1 - 50;
      const cx = (x1 + x2) / 2;
      path = `M ${x1} ${y1} Q ${cx} ${y1 - 40}, ${x2} ${y2}`;
    } else if (isDisconnected) {
      // Disconnected route (draw curve with arrow)
      x1 = lastTrip.x2;
      y1 = lastTrip.y2;
      x2 = x1 + this.segmentLength;
      y2 = y1;
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
      showArrow = true;
    }

    return { x1, y1, x2, y2, path, showArrow };
  }
}
