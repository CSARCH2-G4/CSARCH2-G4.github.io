$(document).ready(function() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $("#gooutput").click(function(){
        $(".input-card").hide();
        $(".output-card").show();
        $(".simulation-card").hide();
        $(".retry-button").show();
        $(".poutput-button").hide();

        directMap = simulate('block', 2, 16, 4, memoryMap, 10, 1);
        printVals(directMap)
    })

    $("#submitbtn").click(async function(){
        memoryMap = [1, 7, 5, 20]

        directMap = simulate('block', 2, 16, 4, memoryMap, 10, 1);
        
        snapshots = directMap.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#simulationTable").empty()
        $("#inputSimulation").empty()

        for(var x=0 ; x<cacheSize ; x++) {
            $("#simulationTable").append("<tr> <th scope=\"row\">"+x+"</th><td id=\"block"+x+"\" class=\"text-right\">"+0+"</td> </tr>");
        }

        for(var x=0 ; x<memoryMap.length ; x++) {
            $("#inputSimulation").append("<div class=\"text-center col\" id=\"input"+x+"\">"+memoryMap[x]+"</div>");
        }

        $("#simulation-body").prop('hidden', false);

        for(var y=0 ; y<snapshots.length ; y++) {
            for(var x=0 ; x<cacheSize ; x++) {
                var text = $("#block"+x).text();

                if(snapshots[y][x]!=null)
                    $("#block"+x).text(snapshots[y][x]);

                if(memoryMap[y]==snapshots[y][x])
                    $("#block"+x).attr('style', 'color:de9918');
                else
                    $("#block"+x).attr('style', 'color:black');

                if(snapshots[y][x]==text && memoryMap[y]==snapshots[y][x]){
                    hits = parseInt($("#hits").text())
                    hits++
                    $("#block"+x).text("HIT! "+snapshots[y][x]);
                    $("#hits").text(hits)
                }
                else if(snapshots[y][x]!=text && memoryMap[y]==snapshots[y][x]){
                    misses = parseInt($("#misses").text())
                    misses++
                    $("#block"+x).text("MISS "+snapshots[y][x]);
                    $("#misses").text(misses)
                }
            }
            $("#input"+y).attr('style', 'color:ebba34');
            await sleep(2000);
            console.log(snapshots[y])
        }

        for(var x=0 ; x<cacheSize ; x++) {
            $("#block"+x).attr('style', 'color:black');
            if(snapshots[memoryMap.length-1][x]!=null)
                $("#block"+x).text(snapshots[memoryMap.length-1][x]);
            else
                $("#block"+x).text('0');
        }
    })

    async function printVals(directMap){
        snapshots = directMap.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#output-body").append('<p class="card-text"><b>Number of Cache Hits:</b>'+directMap.cacheHit+'</p>')
        $("#output-body").append('<p class="card-text"><b>Number of Cache Miss:</b>'+directMap.cacheMiss+'</p>')
        $("#output-body").append('<p class="card-text"><b>Miss Penalty (seconds):</b>'+directMap.missPenalty+'</p>')
        $("#output-body").append('<p class="card-text"><b>Average Memory Access Time (seconds):</b>'+directMap.aveAccessTime+'</p>')
        $("#output-body").append('<p class="card-text"><b>Total Memory Access Time (seconds):</b>'+directMap.totalAccessTime+'</p>')
        $("#output-body").append('<p class="card-text"><b>Final Snapshot of Cache Memory:</p>')
        $("#output-body").append("<div class=\"row\"><div class=\"col\"><table class=\"table\" style='width: 40%'><thead class=\"thead-dark\"><tr><th scope=\"col\">Block Number</th><th scope=\"col\">Data</th></tr></thead><tbody id='snapshotTable'></tbody></table></div></div>")
        for(var x=0 ; x<cacheSize ; x++) {
            if(snapshots[memoryMap.length-1][x]!=null)
                $("#snapshotTable").append("<tr> <th scope=\"row\">"+x+"</th><td>"+snapshots[memoryMap.length-1][x]+"</td> </tr>");
            else
                $("#snapshotTable").append("<tr> <th scope=\"row\">"+x+"</th><td>0</td> </tr>");
        }
    }
    
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
        console.log(cacheSnapshot)
    
        aveAccessTime = ( cacheHit / (cacheHit + cacheMiss) ) * cacheAccessTime +
                        ( cacheMiss / (cacheHit + cacheMiss) ) * missPenalty;
    
        totalAccessTime = cacheHit * 2 * cacheAccessTime +
                          cacheMiss * 2 * (memAccessTime + cacheAccessTime) + 
                          cacheMiss * cacheAccessTime;
        return { cacheHit, cacheMiss, missPenalty, aveAccessTime, totalAccessTime, cacheSnapshot }
    }
    
    // console.log(simulate('block', 2, 16, 4, [1, 7, 5, 0, 2, 1, 5, 6, 5, 2, 2, 0], 10, 1));
    
})
