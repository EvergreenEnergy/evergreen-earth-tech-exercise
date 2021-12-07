import axios from 'axios';



export const getCustomerByRegion = async (designRegion) => {

    const request = await axios.get(`https://063qqrtqth.execute-api.eu-west-2.amazonaws.com/v1/weather?location=${designRegion}`
        , {
            headers: {
                'x-api-key': process.env.X_API_KEY
            }
        }).then(res => {
            return res;
        }).catch(error => {
            return error
        })
    return request
}

