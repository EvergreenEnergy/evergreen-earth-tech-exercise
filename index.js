import {getCustomerByRegionsOf} from './src/services/customer-service.js'
import { config } from 'dotenv';
config();
console.log('running...')
getCustomerByRegionsOf();