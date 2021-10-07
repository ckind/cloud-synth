class TestProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	process(inputList, outputList, parameters) {
		const input = inputList[0];
		const output = outputList[0];

		for (let channel = 0; channel < input.length; channel++) {
			const inputChannel = input[channel];
			const outputChannel = output[channel];

			for (let i = 0; i < inputChannel.length; i++) {
				outputChannel[i] = inputChannel[i] * 1.0;
			}
		}

		return true;
	}
};

registerProcessor("test", MyAudioProcessor);

// example use in effects device
// ToneContext.addAudioWorkletModule("./audioWorklets/test.worklet.js", "test").then(
//   () => {
//     const test = ToneContext.createAudioWorkletNode("test");
//     this.input.chain(test, this.output);
//   }
// );