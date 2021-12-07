import {getCustomerByRegions} from './src/services/customer-service.js'
import { config } from 'dotenv';
config();
console.log('calculating customer quote...')
getCustomerByRegions();