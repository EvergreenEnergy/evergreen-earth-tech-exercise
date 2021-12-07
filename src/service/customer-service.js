// import * as  customerRegion from '../../config.js';
import axios from 'axios';
import { readFile, truncate, appendFile } from 'fs/promises';
import { getCustomerByRegion } from '../../config.js'




const data = JSON.parse(await readFile(new URL('../../houses.json', import.meta.url)));
const findHeatPump = JSON.parse(await readFile(new URL('../../heat-pumps.json', import.meta.url)));
const houseData = JSON.parse(JSON.stringify(data))

export const getCustomerByRegions = async () => {
   

};