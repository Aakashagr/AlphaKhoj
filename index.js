/**
 * @title searchapp
 * @description oddballtask
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 * @audioDir audio
 * @videoDir video
 * @miscDir misc
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { initJsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";

import jsPsychSearchArray from "./plugin-search-array.js";
import jsPsychAudioButtonResponse from "./plugin-audio-button-grid.js";

import stimuli from './stimuli.json';
/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
	var jsPsych = initJsPsych({
		default_iti: 1000,
		show_progress_bar: true,
	    auto_update_progress_bar: false
	});

    var Atimeline = []
    var imgnames = ['media/images/a.png','media/images/aa.png','media/images/ba.png','media/images/i.png','media/images/o.png']
    var audnames = ['media/audio/a.wav','media/audio/aa.wav','media/audio/ba.wav','media/audio/i.wav','media/audio/o.wav']


    // Preload assets
    Atimeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
    show_progress_bar:true
    });

    // Welcome screen
    Atimeline.push({
      type: jsPsychHtmlButtonResponse,
		stimulus: '<p>Welcome to this game of finding the odd-one-out.</p><p> Turn on the audio and click next to begin.</p>',
		choices: ['Next'],
	   on_start: function() {
		jsPsych.setProgressBar(0);
		}
    });

    // Switch to fullscreen
    Atimeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
    });

    var allstim = []

	for (var q = 0; q < stimuli.length; q++) {
	var stimarray = []
	var target = 'media/images/'+stimuli[q]['T'] + '.png'
	var distractor = 'media/images/'+ stimuli[q]['D'] + '.png'
	stimarray.push(jsPsych.randomization.randomInt(0,8))
	for (var i = 0; i < 9; i++) {
		if (i == stimarray[0]) {
			stimarray.push(target)
		} else {
			stimarray.push(distractor)
		}
	}
	allstim.push(stimarray)
	}

	var allstim = jsPsych.randomization.shuffle(allstim); // randomising the trials
	var n_trials = 20;

	// set up a single trial
	var trial= {
		type: jsPsychSearchArray,
		stimulus: '',
		choices: function() {return allstim[0].slice(1,allstim[0].length);}, // always play the first stimulus in the array
		tloc: function() {return allstim[0][0];},
		image_size: [window.innerWidth/5,window.innerHeight/5],
		//button_html: '<button class="vs-btn"><img src = "%choice%"></button>',
		button_html: '<img src="%choice%"/ width = "50%" height="auto" align ="center">',
		grid_size: [3,3],

		on_finish: function (data) {
			data.iscorrect = data.response == allstim[0][0]
			// var audio = new Audio('audio/'+ allstim[0][data.response+1].split(/[/.]/)[1]+ '.wav');
			//audio.play();

			var tid = allstim[0][allstim[0][0]+1]  // identifying the target id
			if(!data.iscorrect) {
				var rand_index = jsPsych.randomization.randomInt(1,allstim.length);
				var temp = trial.choices()
				temp = jsPsych.randomization.shuffle(temp); // Changning the location of distractor
				temp.unshift(temp.indexOf(tid)) // identifying the location of target after shuffing
				allstim.splice(rand_index, 0,temp); // inserting the incorrect trial at random location
			}
			allstim.splice(0, 1);  // removing the current displayed trial
			if(data.iscorrect) {
				var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
				jsPsych.setProgressBar(curr_progress_bar_value + (1/n_trials));
			}
		}
	};

	// loop over this trial until there are no more stimuli left in the array
	var loop_node = {
		timeline: [trial],
		loop_function: function(data) {
			if (allstim.length == 0) {
				return false;
			} else {
				return true;
			}
		}
	}

	Atimeline.push(loop_node)


	// Next task
	var start = {
      type: jsPsychHtmlButtonResponse,
		stimulus: '<p>The practise block is now finished. Click Next to test your Learning.</p><p> Here, select the symbol that matches the audio played </p> ',
		choices: ['Next'],
	   on_start: function() {
		jsPsych.setProgressBar(0);
		}
    };
	Atimeline.push(start)

	// Test trials
	var allstim_test = []
	allstim_test = [[imgnames[0],imgnames[3],imgnames[1],imgnames[2]],
				[imgnames[2],imgnames[1],imgnames[3],imgnames[4]],
				[imgnames[4],imgnames[2],imgnames[0],imgnames[3]],
				[imgnames[1],imgnames[4],imgnames[2],imgnames[3]],
				[imgnames[3],imgnames[0],imgnames[4],imgnames[1]],]
	var allaudio = audnames;
	var test_tar = [0,1,1,3,2]
	var n_trials_test = 5
	// set up a single trial
	var trial_test = {
		type: jsPsychAudioButtonResponse,
		stimulus: function() {return allaudio[0]},
		choices: function() {return allstim_test[0]},//.slice(1,allstim[0].length);}, // always play the first stimulus in the array
		image_size: [window.innerWidth/2,window.innerHeight/2],
		button_html: '<img src="%choice%"/ width = "70%" height="auto" align ="center">',
		tloc: function() {return test_tar[0];},

		data: {
        task: 'response',
		},

		on_finish: function (data) {
			var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
			jsPsych.setProgressBar(curr_progress_bar_value + (1/n_trials_test));
			data.iscorrect = data.response == test_tar[0]
			allstim_test.splice(0, 1);  // removing the current displayed trial
			allaudio.splice(0,1);
			test_tar.splice(0,1);
		}
	};

	// loop over this trial until there are no more stimuli left in the array
	var loop_node_test = {
		timeline: [trial_test],
		loop_function: function(data) {
			if (allstim_test.length == 0) {
				return false;
			} else {
				return true;
			}
		}
	}

	Atimeline.push(loop_node_test)


	var done = {
    type: jsPsychHtmlKeyboardResponse,
	stimulus: function() {
		var trials = jsPsych.data.get().filter({task: 'response'});
		var correct_trials = trials.filter({iscorrect: true});
		var accuracy = correct_trials.count();
		return `<p> Done! Thank you.</p> <p>You responded correctly on ${accuracy} out of 5 trials.</p>`
		  }
	};

	Atimeline.push(done)

    await jsPsych.run(Atimeline);

    // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
    // if you handle results yourself, be it here or in `on_finish()`)
    return jsPsych;
}
