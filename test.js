import dotenv from "dotenv"
dotenv.config()

import { serviceClient } from "./utils/service-client.util.js"

const test = async () => {
  try {
    console.log("🔹 Testing getBooking...")
    const booking = await serviceClient.getBooking("6914fa861cb629f18fd31e75")
    console.log("Booking fetched successfully:", booking)

        console.log("🔹 Testing getItem...")
        const item = await serviceClient.getItem("6914f636f70e06b32b3e414b")
    
        console.log("Item fetched successfully:", item)

  } catch (err) {
    console.error("Test failed:", err.message)
  }
}

test()
