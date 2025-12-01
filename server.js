  import express from "express"
  import dotenv from 'dotenv';
  import {connectdb} from "./lib/db.js"
  import reviewRoutes from "./routes/routes.review.js"
 


  dotenv.config();


  const app = express();

  app.use(express.json());

  
  app.use("/api/reviews", reviewRoutes)

  const PORT = process.env.PORT




  connectdb()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });