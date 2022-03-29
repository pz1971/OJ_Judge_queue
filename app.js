import mongoose from 'mongoose';
import './env.js';
import Submission from './models/submission.js';
import  './judge.js';
import judgeCpp from './judge.js';
import {Mutex} from 'async-mutex';

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})

const cpu0 = new Mutex();
const cpu1 = new Mutex();
const cpu2 = new Mutex();
const cpu3 = new Mutex();

var assignCpu = 0;

const createSubmission = async (filename) => {
    await Submission.create({source:filename, status: 'on_queue'});
    console.log("submission created");
    startJudging();
}

const startJudging = async () => {
    // find and modify one document from the collection with status on_queue
    const submission = await Submission.findOneAndUpdate({status: 'on_queue'}, {status: 'judging'}, {new: true});
    if (!submission)
        return;
    assignCpu = (assignCpu + 1) % 4;

    if (assignCpu == 0) {
        await cpu0.runExclusive(async () => {
            // judge the submission
            await judgeCpp(submission.source, 3, 10240, 0);
        });
    }
    else if (assignCpu == 1) {
        await cpu1.runExclusive(async () => {
            // judge the submission
            await judgeCpp(submission.source, 3, 10240, 1);
        });
    }
    else if (assignCpu == 2) {
        await cpu2.runExclusive(async () => {
            // judge the submission
            await judgeCpp(submission.source, 3, 10240, 2);
        });
    }
    else if (assignCpu == 3) {
        await cpu3.runExclusive(async () => {
            // judge the submission
            await judgeCpp(submission.source, 3, 10240, 3);
        });
    }
}

createSubmission('./OJ/solution.cpp');
createSubmission('./OJ/WA_solution.cpp');
createSubmission('./OJ/TLE_solution.cpp');
createSubmission('./OJ/MLE_solution.cpp');

// await judgeCpp('./OJ/solution.cpp', 3, 10240, 1);


// // cpu core lock flag
// var lock = [0, 0, 0, 0];
// var assignCpu = 3 ;

// import Queue from 'bull';
// const judgeQueue = new Queue('judge');

// // producer
// await judgeQueue.add( { filename: './OJ/solution.cpp' } );
// // await judgeQueue.add( { filename: './OJ/WA_solution.cpp' } );
// // await judgeQueue.add( { filename: './OJ/TLE_solution.cpp' } );
// // await judgeQueue.add( { filename: './OJ/MLE_solution.cpp' } );

// console.log('hello');

// // consumer
// const judge = judgeQueue.process(async (job) => {
//     // assignCpu = (assignCpu + 1) % 4;
//     // // wait until lock[assignCpu] = 0
//     // while(lock[assignCpu] == 1) {
//     //     await sleep(100);
//     // }
//     return judgeCpp(job.data.filename, 3, 10000, assignCpu);
//   });

// await judge();

// import Queue  from 'bee-queue';
// const queue = new Queue('example');

// const job = queue.createJob({x: 2, y: 3});
// job.save();
// job.on('succeeded', (result) => {
//   console.log(`Received result for job ${job.id}: ${result}`);
// });

// // Process jobs from as many servers or processes as you like
// queue.process(function (job, done) {
//   console.log(`Processing job ${job.id}`);
//   return done(null, job.data.x + job.data.y);
// });