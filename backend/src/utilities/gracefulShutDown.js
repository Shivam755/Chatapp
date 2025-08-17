function setupGracefulShutdown(Asynccleanups = [], cleanups = []) {
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) return; // avoid double execution
    isShuttingDown = true;

    console.log(`\nReceived ${signal}, starting cleanup...`);

    try {
      for (const fn of Asynccleanups) {
        await fn(); // each cleanup is async
      }
      for (const fn of cleanups) {
        fn(); // each cleanup is sync
      }
      console.log("✅ Cleanup complete, exiting...");
      // process.exit(0);
    } catch (err) {
      console.error("❌ Error during cleanup:", err);
      process.exit(1);
    }
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

module.exports = { setupGracefulShutdown };
