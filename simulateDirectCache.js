function convertToBlock(blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap) {
    const w = Math.log2(blockSize);
    const k = Math.log2(cacheMemorySize);
    const tag = mainMemorySize - w - k;

    // TODO: Do conversion function

    return { mainMemorySize, cacheMemorySize, mainMemoryMap };
}

/**
 * Simulates the cache mapping function
 * @param {String} viewAs Either as 'address' or as 'block'
 * @param {Number} blockSize Integer power of 2 that represents block size in words
 * @param {Number} mainMemorySize Integer power of 2 that represents the size of a memory block in bits
 * @param {Number} cacheMemorySize Integer power of 2 that represents the cache size in words
 * @param {Array} mainMemoryMap Array of integers that represent the blocks or addresses to be mapped
 * @param {Number} memAccessTime Number that represents the time taken to access the main memory. Keep unit the same as cacheAccessTime
 * @param {Number} cacheAccessTime Number that represents the time taken to access the cache memory. Keep unit the same as memAccessTime
 */
function simulate (viewAs, blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime) {

    let cacheHit = 0, 
        cacheMiss = 0,
        missPenalty = (cacheAccessTime + memAccessTime) * 2,
        aveAccessTime, 
        totalAccessTime = 0,
        cacheSnapshot = [];

    if (viewAs === 'address') {
        convResult = convertToBlock(blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap);
        mainMemorySize = convResult.mainMemorySize;
        cacheMemorySize = convResult.cacheMemorySize;
        mainMemoryMap = convResult.mainMemoryMap;
    }

    let cache = Array(cacheMemorySize).fill(null);
    
    mainMemoryMap.forEach(blockNum => {
        let blockMap = blockNum % cacheMemorySize;

        if (cache[blockMap] === null || cache[blockMap] !== blockNum ) {
            cacheMiss += 1;
        } else {
            cacheHit += 1;
        }

        cache[blockMap] = blockNum;
        cacheSnapshot.push([...cache]);
    });

    aveAccessTime = ( cacheHit / (cacheHit + cacheMiss) ) * cacheAccessTime +
                    ( cacheMiss / (cacheHit + cacheMiss) ) * missPenalty;

    totalAccessTime = cacheHit * 2 * cacheAccessTime +
                      cacheMiss * 2 * (memAccessTime + cacheAccessTime) + 
                      cacheMiss * cacheAccessTime;

    return { cacheHit, cacheMiss, missPenalty, aveAccessTime, totalAccessTime, cacheSnapshot }
}

// console.log(simulate('block', 2, 16, 4, [1, 7, 5, 0, 2, 1, 5, 6, 5, 2, 2, 0], 10, 1));
