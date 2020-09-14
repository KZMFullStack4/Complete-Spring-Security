export class MomentSheet {
    constructor(public oilTankId?: number,
                public oilTankTitle?: string,
                public oilTankCode?: string,
                public dayDepotId?: number,
                public dayDepotSystemAmount?: number,
                public addition?: number,
                public deductible?: number,
                public startMeasurementOilTankAmount?: number,
                public startMeasurementOilTankAmountDeep?: number,
                public endMeasurementOilTankAmount?: number,
                public endMeasurementOilTankAmountDeep?: number,
                public receivedFromOilTanks?: number,
                public receivedFromLogBooks?: number,
                public receivedFromUnitOilTanks?: number,
                public sumOfReceive?: number,
                public sendToUnitOilTanks?: number,
                public sendToServiceOilTanks?: number,
                public sendToContaminatedOilTanks?: number,
                public sendToOilTanks?: number,
                public sendToLogBooks?: number,
                public sumOfSends?: number,
    ) {
    }
}