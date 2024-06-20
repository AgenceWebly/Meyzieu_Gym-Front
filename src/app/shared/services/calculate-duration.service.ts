import { Injectable } from '@angular/core';
import { TrainingSlot } from '../../models/trainingSlot';

@Injectable({
  providedIn: 'root',
})
export class CalculateDurationService {
  constructor() {}

  calculateWeeklyDuration(trainingSlots: TrainingSlot[]): string {
    let totalMinutes = 0;

    trainingSlots.forEach((slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}Z`);
      const end = new Date(`1970-01-01T${slot.endTime}Z`);
      totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let hoursText = '';
    if (hours > 0) {
      hoursText = `${hours} heure`;
      if (hours > 1) {
        hoursText += 's';
      }
    }

    let minutesText = '';
    if (minutes > 0) {
      minutesText = `${minutes} minutes`;
      if (hours > 0) {
        minutesText = ` et ${minutesText}`;
      }
    }

    return hoursText + minutesText;
  }
}
