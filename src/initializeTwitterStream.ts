import { streamConnect } from "./stream";
import { getAllRules, setRules, deleteAllRules } from "./rules";

const initializeTwitterStream = async () => {
  let currentRules;

  try {
    // Gets the complete list of rules currently applied to the stream
    currentRules = await getAllRules();

    // Delete all rules. Comment the line below if you want to keep your existing rules.
    await deleteAllRules(currentRules);

    // Add rules to the stream. Comment the line below if you don't want to add new rules.
    await setRules();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  // Listen to the stream.
  streamConnect(0);
};

export default initializeTwitterStream;
