export async function downloadFromUrl(url, filename, fromCache = false) {
    try {
        let response;
        if (fromCache) {
            response = await fetch(url, { mode: "no-cors", cache: "force-cache" });
        } else {
            response = await fetch(url);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename || url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Executes async tasks with limited concurrency.
 *
 * @template T
 * @param {(() => Promise<T>)[]} tasks
 * @param {number} concurrency
 * @returns {Promise<T[]>}
 */
export async function promisePool(tasks = [], concurrency = 1) {
    const results = new Array(tasks.length);
    let nextIndex = 0;

    async function worker() {
        while (true) {
            const index = nextIndex++;
            if (index >= tasks.length) {
                return;
            }

            try {
                if(typeof tasks[index]==="function"){
                    results[index] = { index, status: "succ", data: await tasks[index]()};

                }else{
                    results[index] = { index, status: "succ", data: tasks[index]};
                }
            } catch(err) {
                results[index] = { index, status: "failed",reason: err.message};
            }
            await sleep(random(100, 300));
        }
    }

    const workers = Array.from(
        { length: Math.min(concurrency, tasks.length) },
        worker
    );

    await Promise.all(workers);
    return results;
}
