import axios from "axios"


export const serviceClient = {
    getBooking :async(bookingId)=>{
        try {
            const response = await axios.get(`${process.env.BOOKING_SERVICE_URL}/api/booking/service/${bookingId}`,{
                headers :{
                    Authorization : `Bearer ${process.env.SERVICE_TOKEN}`,
                    "Content-Type": "application/json",
                },
                timeout : 5000
            })
            return response.data.booking
        } catch (error) {
             console.error(`Failed to fetch booking ${bookingId}:`, error.message)
             throw new Error(`Booking Service unavailable: ${error.message}`)
        }
    }
}