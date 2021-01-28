$(document).ready(function() {

    var viewAs, bloc2kSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime
    // Value Sequence Builder
    var sequence = [];
    $("#addValues").click(function() {
        // Get value fromt textbox
        var stringSequence = $("#input_mainMemoryMap").val();
        // Separate each using comma
        var arraySequence = stringSequence.split(",");
        // Trim white spaces
        var noSpace = $.map(arraySequence, $.trim);
        var integerSequence = noSpace.map(function(x) {
            return parseInt(x, 10);
        });

        // Get multiplier
        var multiplier = parseInt($("#input_mainMemoryMult").val());
        
        // Add to sequence
        for(var i = 0; i < multiplier; i++) {
            sequence = sequence.concat(integerSequence);
        }

  
        // Add to table 
        $("#sequenceBody").empty();
        for(var i = 0; i < sequence.length; i++){
            var row = "<tr> <td>" + i + "</td>" + "<td> "+ sequence[i] + "</td> </tr>"
            $("#sequenceBody").append(row);
        }

        console.log(sequence);
    });

    $("submitInputs").click(function() {
        
    });
    








    
});



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
 * @param {Number} bloc2kSize Integer power of 2 that represents block size in words
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
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    $("#submitbtn").click(async function(){
        $(document).scrollTop(700)
        memoryMap = [1, 7, 5, 0, 2, 1, 5, 6, 5, 2, 2, 0]

        directMap = simulate('block', 2, 16, 4, memoryMap, 10, 1);
        snapshots = directMap.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#simulationTable").empty()
        $("#inputSimulation").empty()

        for(var x=0 ; x<cacheSize ; x++) {
            $("#simulationTable").append("<tr> <th scope=\"row\">"+x+"</th><td id=\"block"+x+"\">"+0+"</td> </tr>");
        }

        for(var x=0 ; x<memoryMap.length ; x++) {
            $("#inputSimulation").append("<th class=\"text-center\" scope=\"col\" id=\"input"+x+"\">"+memoryMap[x]+"</th>");
        }

        $("#simulation-body").prop('hidden', false);;

        for(var y=0 ; y<snapshots.length ; y++) {
            for(var x=0 ; x<cacheSize ; x++) {
                if(snapshots[y][x]!=null)
                    $("#block"+x).text(snapshots[y][x]);

                if(memoryMap[y]==snapshots[y][x])
                    $("#block"+x).attr('style', 'color:red');
                else
                    $("#block"+x).attr('style', 'color:black');
            }
            $("#input"+y).attr('style', 'color:red');
            await sleep(2000);
            console.log(snapshots[y])
        }

        for(var x=0 ; x<cacheSize ; x++) {
            $("#block"+x).attr('style', 'color:black');
        }
    })

// console.log(simulate('block', 2, 16, 4, [1, 7, 5, 0, 2, 1, 5, 6, 5, 2, 2, 0], 10, 1));
    
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
}
