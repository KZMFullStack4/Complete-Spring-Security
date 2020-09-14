import {BaseEntity} from '../../../shared/index';

export const enum ColorimetricType {
    'A0',
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'A9',
    'A10',
    'B0',
    'B1',
    'B2',
    'B3',
    'B4',
    'B5',
    'B6',
    'B7',
    'B8',
    'B9',
    'B10',
    'C0',
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'C6',
    'C7',
    'C8',
    'C9',
    'C10'
}

export class MilliPoor implements BaseEntity {
    constructor(
        public id?: number,
        public wet?: ColorimetricType,
        public dry?: ColorimetricType,
        public gravimetric?: number,
        public date?: any,
        public isSend?: boolean,
    ) {
        this.isSend = false;
    }
}
