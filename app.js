import mongoose from 'mongoose';
import './env.js';
import Submission from './models/submission.js';
import  './judge.js';
import judgeCpp from './judge.js';

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true, useUnifiedTopology: true
// })

// // cpu core lock flag
// var lock = [0, 0, 0, 0];
// var assignCpu = 3 ;

// const createSubmission = async (filename) => {
//     await Submission.create({source:filename, status: 'on_queue'});
//     console.log("submission created");
//     await startJudging();
// }

// const startJudging = async () => {
//     // find one on_queue submission
//     const submission = await Submission.findOne({status: 'on_queue'});

//     // if no submission found, return
//     if(!submission) return;
    
//     // save submission status to judging
//     await submission.update({status: 'judging'});
//     assignCpu = (assignCpu + 1) % 4;
    
//     // wait until lock[assignCpu] = 0
//     while(lock[assignCpu] == 1) {
//         await sleep(100);
//     }

//     // lock cpu core
//     lock[assignCpu] = 1;
//     await judgeCpp(submission.source, 3, 10000, assignCpu);
//     lock[assignCpu] = 0;
//     await submission.update({status: 'AC'});
//     console.log("submission judged");
// }

// createSubmission('./OJ/solution.cpp');
// createSubmission('./OJ/WA_solution.cpp');
// createSubmission('./OJ/TLE_solution.cpp');
// createSubmission('./OJ/MLE_solution.cpp');


// cpu core lock flag
var lock = [0, 0, 0, 0];
var assignCpu = 3 ;

import Queue from 'bull';
const judgeQueue = new Queue('judge');

// producer
await judgeQueue.add( { filename: './OJ/solution.cpp' } );
// await judgeQueue.add( { filename: './OJ/WA_solution.cpp' } );
// await judgeQueue.add( { filename: './OJ/TLE_solution.cpp' } );
// await judgeQueue.add( { filename: './OJ/MLE_solution.cpp' } );

console.log('hello');

// consumer
judgeQueue.process(async (job) => {
    // assignCpu = (assignCpu + 1) % 4;
    // // wait until lock[assignCpu] = 0
    // while(lock[assignCpu] == 1) {
    //     await sleep(100);
    // }
    // return await judgeCpp(job.data.filename, 3, 10000, assignCpu);
    console.log('hello')
  });