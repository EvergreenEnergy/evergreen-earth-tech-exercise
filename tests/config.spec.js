import { getCustomerByRegion } from '../config.js';
import axios from 'axios'
import { expect } from 'chai';
import sinon from 'sinon'

describe('should get customer data with given rigion', async () => {
    afterEach(function () {
        sinon.restore();
      });

    it('should return with status 200 AND statusText "OK" if it exists', async () => {
             sinon.stub(axios, 'get')
            .returns(Promise.resolve({ status: 200, statusText: 'OK' }))
        const getData = await getCustomerByRegion('Thames Valley (Heathrow)')
        expect(getData).to.deep.equal({ status: 200, statusText: 'OK' })
    });
    it('should return with status 404 AND statusText "error" if it exists', async () => {

        sinon.stub(axios, 'get')
            .returns(Promise.resolve({ status: 400, statusText: 'ERROR' }))
        const getData = await getCustomerByRegion('Thames Valley (Heathrow)')
        expect(getData).to.deep.equal({ status: 400, statusText: 'ERROR' })
    });
});




