import express from 'express';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './db/db_connection.js';
import apiV1 from './src/routes/api_v1.js';
import { globalErrorHandler } from './utils/error_handler.js';
import redisClient  from './db/redis_connection.js';
import updateEventStatus from './src/crons/update_event.js';

const bootStrap = (app) => { 
connectDB();
redisClient.connect();
 app.use(express.json({limit: '50mb'})); // Parse JSON bodies 
app.use(hpp());
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
const port = process.env.PORT || 3000;

app.use(apiV1); 

app.get('/',(req,res)=>{
    res.json({
        message: 'Welcome to the eventX API'
    })
})
// Handle 404 errors
app.all('*',(req,res)=>res.status(404).json({
    message: 'Not found'
}));

//global error handler middleware
app.use(globalErrorHandler);

// Start the server
app.listen(port, () => console.log(`event booking app listening on port ${port}!`));
updateEventStatus();

}
export default bootStrap;