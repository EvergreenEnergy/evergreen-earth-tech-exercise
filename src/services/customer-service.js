// import * as  customerRegion from '../../config.js';
import axios from 'axios';
import { readFile, truncate, appendFile } from 'fs/promises';
import { getCustomerByRegion } from '../../config.js'




const data = JSON.parse(await readFile(new URL('../../houses.json', import.meta.url)));
const findHeatPump = JSON.parse(await readFile(new URL('../../heat-pumps.json', import.meta.url)));
const houseData = JSON.parse(JSON.stringify(data))

export const getCustomerDetails = async (designRegion) => {
    return await getCustomerByRegion(designRegion)
}

export const getCustomerByRegions = async () => {
    return houseData.forEach(cust => {
        getCustomerDetails(cust.designRegion).then(res => {
            if (res.statusText === 'OK') {
                getOutPutSummaryToCalculateCost(cust, res)

            } else {
                getErrorResponse(cust, res);

            }
        })
    })
}

export const getOutPutSummaryToCalculateCost = (cust, res) => {

    const heatLost = cust.floorArea * cust.heatingFactor * cust.insulationFactor //= heat loss (kWh)
    const powerHeatLoss = heatLost / res.data.location.degreeDays;

    const getRecommendedHeatPump = getHeatPumpByOutputCapacity(powerHeatLoss);
    const CostBreatDown = getRecommendedHeatPump.costs.map(cost => {
        return `
         ${cost.label}  ${cost.cost} `
    })

    const getTotalCost = calcuateTotalCostWithVAT(getRecommendedHeatPump)

    const response = `
    --------------------------------------
        ${cust.submissionId}
    --------------------------------------
        Estimated Heat Loss = ${heatLost}
        Design Region = ${cust.designRegion}
        Power Heat Loss = ${powerHeatLoss}
        Recommended Heat Pump = ${getRecommendedHeatPump.label}
        Cost Breakdown
        ${CostBreatDown}
        ...
        Total Cost, including VAT =  ${getTotalCost}
    `
    appendFile('customer-quote.txt', response)

    return response
}

export const getErrorResponse = (cust, res) => {
    const error = `
    --------------------------------------
        ${cust.submissionId}
    --------------------------------------
        Heating Loss: 29710.8
        Warning: Could not find design region
                 `
    appendFile('customer-quote.txt', error)
    return error

}


const getHeatPumpByOutputCapacity = (heatLost) => {

    findHeatPump.sort((a, b) => a.outputCapacity - b.outputCapacity)
    return findHeatPump.sort((a, b) => a.outputCapacity - b.outputCapacity).find(pump => {

        if (pump.outputCapacity > Math.round(heatLost)) {

            const pumps = {
                recommendedPump: pump.label,
                cost: pump.costs
            }

            return pumps
        }

    })
}

const calcuateTotalCostWithVAT = (price) => {
    const result = price.costs.reduce((acc, obj) => { return acc + obj.cost; }, 0);
    return Math.round(result * 1.05)

}

export const customerRegion = {
    // getCustomerDetails,
    // getCustomerByRegion,
    houseData

};