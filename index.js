// import * as  customerRegion from '../../config.js';
import axios from 'axios';
import { readFile, truncate, appendFile } from 'fs/promises';
import { getCustomerByRegion } from '../../config.js'