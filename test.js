import dotenv from "dotenv"
dotenv.config()

import { serviceClient } from "./utils/service-client.util.js"

const test = async () => {
  try {
    console.log("🔹 Testing getBooking...")
    const booking = await serviceClient.getBooking("6914fa861cb629f18fd31e75")
    console.log("Booking fetched successfully:", booking)

  } catch (err) {
    console.error("Test failed:", err.message)
  }
}

test()
