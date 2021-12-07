import * as getCustomer from '../config.js';
import { getCustomerDetails, getErrorResponse, getOutPutSummaryToCalculateCost } from '../src/services/customer-service.js'
import axios from 'axios'
import { expect } from 'chai';
import sinon from 'sinon'
import * as  customerRegion from '../src/services/customer-service.js';
import fs, { appendFile } from 'fs/promises'


describe('should get customer data with given rigion', async () => {

    afterEach(function () {
        sinon.restore();
    });

    it('should response with customer data when valid designRegion is passed', async () => {
        sinon.stub(axios, 'get')
            .returns(Promise.resolve({
                statusText: 'OK',
                status: 200,
                data: {
                    location: {
                        location: 'Severn Valley (Filton)',
                        degreeDays: '1835',
                        groundTemp: '10.6',
                        postcodeddd: 'BS7',
                        lat: '51.507864',
                        lng: '-2.576467'
                    }
                }
            }))
        const getData = await getCustomerDetails('Thames Valley (Heathrow)')

        expect(getData).to.deep.equal({
            statusText: 'OK',
            status: 200,
            data: {
                location: {
                    location: 'Severn Valley (Filton)',
                    degreeDays: '1835',
                    groundTemp: '10.6',
                    postcodeddd: 'BS7',
                    lat: '51.507864',
                    lng: '-2.576467'
                }
            }
        })
        expect(getData.status).to.be.equal(200)

    });
    it('should  return customer quote', async () => {
        const res = {
            statusText: 'OK',
            status: 200,
            data: {
                location: {
                    location: 'Thames Valley (Heathrow)',
                    degreeDays: '2033',
                    groundTemp: '11.3',
                    postcode: 'TW6',
                    lat: '51.470022',
                    lng: '-0.454296'
                }
            }
        }
        const houseData = mockFileResponse('house');
        const getData = getOutPutSummaryToCalculateCost(houseData, res)
        const mockResponse = getMockResponse()
        expect(getData).to.be.equals(mockResponse)

    });

});

it('should  return error response when  designRegion cannot be found', async () => {

    const fileResponse = mockFileResponse('house');
    const data = JSON.parse(JSON.stringify(fileResponse))

    const mockRes = getMockErrorResponse(fileResponse);
    const mockResponse = getErrorResponse(data)
    expect(mockResponse).to.be.equal(mockRes)

});


const mockFileResponse = (fileName) => {
    if (fileName === 'house') {
        return {
            "submissionId": "3d8f19b0-3886-452d-a335-f3a2e7d9f5a5",
            "designRegion": "Thames Valley (Heathrow)",
            "floorArea": 109,
            "age": "1930 - 1949",
            "heatingFactor": 90,
            "insulationFactor": 1.2
        }
    }

}
const getMockResponse = () => {


    const response = `
    --------------------------------------
        3d8f19b0-3886-452d-a335-f3a2e7d9f5a5
    --------------------------------------
        Estimated Heat Loss = 11772
        Design Region = Thames Valley (Heathrow)
        Power Heat Loss = 5.790457452041318
        Recommended Heat Pump = 8kW Package
        Cost Breakdown
        
         Design & Supply of your Air Source Heat Pump System Components (8kW)  4216 ,
         Installation of your Air Source Heat Pump and Hot Water Cylinder  2900 ,
         Supply & Installation of your Homely Smart Thermostat  150 ,
         Supply & Installation of a new Consumer Unit  300 ,
         MCS System Commissioning & HIES Insurance-backed Warranty  1648 
        ...
        Total Cost, including VAT =  9675
    `
    return response

}

const getMockErrorResponse = (cust) => {
    const error = `
    --------------------------------------
        ${cust.submissionId}
    --------------------------------------
        Heating Loss: 29710.8
        Warning: Could not find design region
                 `
    return error

}




