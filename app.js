import mongoose from 'mongoose';
import './env.js';
import Submission from './models/submission.js';
import  './judge.js';
import judgeCpp from './judge.js';

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})

// cpu core lock flag
var lock = [0, 0, 0, 0];

const createSubmission = async (filename) => {
    await Submission.create({source:filename, status: 'on_queue'});
    console.log("submission created");
    await startJudging();
}

const startJudging = async () => {
    // find and modify one document from the collection with status on_queue
    const submission = await Submission.findOneAndUpdate({status: 'on_queue'}, {status: 'judging'}, {new: true});
    if (submission) {
        // console.log("submission found");
        // assign cpu core
        var cpu = 0;
        while (1) {
            if (lock[cpu] == 0) {
                lock[cpu] = 1;
                break;
            } else {
                cpu = (cpu + 1) % 4;
            }
            // sleep for 100ms
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // judge the submission
        await judgeCpp(submission.source, 3, 10240, cpu);
        console.log(`judging: ${submission.source}`);
        // release cpu core
        lock[cpu] = 0;
        // update the status of the submission
        var x = await Submission.findOneAndUpdate({source: submission.source}, {status: 'AC'}, {new: true});
        console.log(`submission ${x.source} is AC`);
    }
}

createSubmission('./OJ/solution.cpp');
// createSubmission('./OJ/WA_solution.cpp');
// createSubmission('./OJ/TLE_solution.cpp');
// createSubmission('./OJ/MLE_solution.cpp');

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