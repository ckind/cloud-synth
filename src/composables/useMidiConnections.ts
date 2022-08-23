import { IMidiReceiver } from "@/shared/interfaces/midi/IMidiReceiver";

export function useMidiConnections() {
	const connections = new Array<IMidiReceiver>();

	function connect(receiver: IMidiReceiver) {
		connections.push(receiver);
	}

	function disconnect(receiver: IMidiReceiver) {
		const i = connections.indexOf(receiver);
		if (i > -1) {
			connections.splice(i, 1);
		} else {
			throw `no existing connection to given midi receiver`;
		}
	}

	return {
		connect,
		disconnect,
		connections
	}
}