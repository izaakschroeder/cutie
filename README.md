# cutie

Unopinionated, streaming task queue.

![build status](http://img.shields.io/travis/izaakschroeder/cutie.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/cutie.svg?style=flat)
![license](http://img.shields.io/npm/l/cutie.svg?style=flat)
![version](http://img.shields.io/npm/v/cutie.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/cutie.svg?style=flat)

Cutie is a streaming task queue with a similar design philosophy to gulp. Queues are streams that emit jobs to workers, and then when workers complete the job they emit the job themselves.

Because of this, `cutie` presently has no code and simply defines an API specification that other queues and workers adhere to. To conform to a specific version list `"cutie": "^version"` in your `peerDependencies`.

Sending jobs is as easy as:

```javascript
var job = { foo: 'bar' };
// Write job to the queue stream
queue.write(job);
```

Processing jobs is as easy as:

```javascript
var worker = through2.obj(function(job, enc, done) {
	// do work
	...
	// report the job as finished
	done(null, job);
});
queue.pipe(worker);
```

You can control worker parallelism by specifying its `highWaterMark`:

```javascript
// Run only 1 job at a time with this
var worker = through2({ objectMode: true, highWaterMark 1 }, ...);
```

Available queues:
 * [SQS](https://www.github.com/izaakschroeder/cutie-sqs)
