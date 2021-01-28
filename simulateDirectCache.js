$(document).ready(function() {

    var viewAs, bloc2kSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime
    // Value Sequence Builder
    var sequence = [];
    $("#addValues").click(function() {
        viewAs = $('input[name=flexRadioDefault]:checked', '#viewform').val();

        // Get value fromt textbox
        var stringSequence = $("#input_mainMemoryMap").val();
        if(stringSequence.trim() != "") {

            // Valid Inputs
            $("#input_mainMemoryMap").removeClass("is-invalid");
            $("#input_mainMemoryMap").addClass("is-valid");
        
            // Separate each using comma
            var arraySequence = stringSequence.split(",");
            // Trim white spaces
            var noSpace = $.map(arraySequence, $.trim);

            
            var integerSequence = noSpace.map(function(x) {
                return parseInt(x, 10);
            });

            // Check per element validity
            var elementsAreValid = true;
            for(var i = 0; i < integerSequence.length; i++) {
                console.log(isNaN(integerSequence[i]))
                if(elementsAreValid) {
                    if(!isNaN(integerSequence[i])){
                        elementsAreValid = true;
                    }
                    else {
                        elementsAreValid = false;
                    }
                }
            }

            if(elementsAreValid) {
                // Get multiplier
                var multiplier = parseInt($("#input_mainMemoryMult").val());
                if (multiplier > 0) {
                    // Remove error messages
                    $("#input_mainMemoryMult").removeClass("is-invalid");

                    // Add to sequence
                    for (var i = 0; i < multiplier; i++) {
                        sequence = sequence.concat(integerSequence);
                    }

                    // Add to table 
                    $("#sequenceBody").empty();
                    for (var i = 0; i < sequence.length; i++) {
                        var row = "<tr> <td>" + i + "</td>" + "<td> " + sequence[i] + "</td> </tr>"
                        $("#sequenceBody").append(row);
                    }
                }
                else {
                    $("#input_mainMemoryMult").removeClass("is-valid");
                    $("#input_mainMemoryMult").addClass("is-invalid");
                }
            }
            else {
                $("#input_mainMemoryMap").removeClass("is-valid");
                $("#input_mainMemoryMap").addClass("is-invalid");
            } 

        }
        else {
            $("#input_mainMemoryMap").removeClass("is-valid");
            $("#input_mainMemoryMap").addClass("is-invalid");
        }
        
        console.log(sequence);
    });

    $("#submitInputs").click(function() {
        
       
        viewAs = $('input[name=flexRadioDefault]:checked', '#viewform').val();
        viewSizeAs = $('input[name=radioUnit]:checked', '#viewformSize').val();
        block2kSize = parseInt($("#input_blocksize").val());
        if(viewSizeAs == 'block') {
            mainMemorySize = parseInt($("#input_mmsize").val());
            cacheMemorySize = parseInt($("#input_cmsize").val());
        }
        else {
            mainMemorySize = parseInt($("#input_mmsize").val()) / block2kSize;
            cacheMemorySize = parseInt($("#input_cmsize").val()) / block2kSize;
        }
        mainMemoryMap = sequence;
        memAccessTime = parseFloat($("#input_memaccesstime").val());
        cacheAccessTime = parseFloat($("#input_cacheaccesstime").val());
        console.log(viewSizeAs);
        
        
    
        // Validation
        var validBlock2kSize = powerOfTwo(block2kSize);
        var validmainMemorySize = powerOfTwo(mainMemorySize);
        var validcacheMemorySize = powerOfTwo(cacheMemorySize);
        var validmemAccessTime  = checkPositive(memAccessTime);
        var validcacheAccessTime = checkPositive(cacheAccessTime);
        var validAll = validBlock2kSize && validmainMemorySize && validcacheMemorySize && validmemAccessTime && validcacheAccessTime;
        
        // console.log(validBlock2kSize + " " + validmainMemorySize + " " + validcacheMemorySize + " " + validmemAccessTime + " " + validcacheAccessTime + " ");
        
        // Block Size Validation
        if(validBlock2kSize) {
            $("#input_blocksize").removeClass("is-invalid");
            $("#input_blocksize").addClass("is-valid");
        }
        else {
            $("#input_blocksize").addClass("is-invalid");
            $("#input_blocksize").removeClass("is-valid");
        }

        // Main Memory Size Validation
        if(validmainMemorySize) {
            $("#input_mmsize").removeClass("is-invalid");
            $("#input_mmsize").addClass("is-valid");
        }
        else {
            $("#input_mmsize").addClass("is-invalid");
            $("#input_mmsize").removeClass("is-valid");
        }

         // Cache Memory Size Validation
         if(validcacheMemorySize) {
            $("#input_cmsize").removeClass("is-invalid");
            $("#input_cmsize").addClass("is-valid");
        }
        else {
            $("#input_cmsize").addClass("is-invalid");
            $("#input_cmsize").removeClass("is-valid");
        }

         // Memory Access Time Validation
         if(validmemAccessTime) {
            $("#input_memaccesstime").removeClass("is-invalid");
            $("#input_memaccesstime").addClass("is-valid");
        }
        else {
            $("#input_memaccesstime").addClass("is-invalid");
            $("#input_memaccesstime").removeClass("is-valid");
        }

         // Memory Access Time Validation
         if(validcacheAccessTime) {
            $("#input_cacheaccesstime").removeClass("is-invalid");
            $("#input_cacheaccesstime").addClass("is-valid");
        }
        else {
            $("#input_cacheaccesstime").addClass("is-invalid");
            $("#input_cacheaccesstime").removeClass("is-valid");
        }

        if(validAll) {
            // Run simulation here
        }
        else {
            alert("Please fix the errors indicated.");
        }

    });

    function checkPositive(value) {
        return value > 0;
    }

    function powerOfTwo(x) {
        return (Math.log(x)/Math.log(2)) % 1 === 0;
    }
    
});

// console.log(convertToBlock( 4, 64, 4, [111, 110011,11001001]));


function convertToBlock(blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap) {
    const w = Math.log2(blockSize);
    const k = Math.log2(cacheMemorySize);

    const tag = mainMemorySize - w - k;

    // TODO: Do conversion function
    for(var i = 0; i < mainMemoryMap.length; i++){
        var stringBinary = mainMemoryMap[i].toString();
        var removeWord = stringBinary.slice(0, 0-w);
        var binaryString = removeWord.slice(0-k);
        console.log("String: " + stringBinary);
        console.log("remove w: " + removeWord);
        console.log("binary string : " + binaryString);
        var integerValue = parseInt(binaryString, 2);
        mainMemoryMap[i] = integerValue;
    }





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
        memoryMap = [1, 7, 5, 0, 2, 1, 5, 6, 5]

        directMap = simulate('block', 2, 16, 4, memoryMap, 10, 1);
        snapshots = directMap.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#simulationTable").empty()
        $("#inputSimulation").empty()

        for(var x=0 ; x<cacheSize ; x++) {
            $("#simulationTable").append("<tr> <th scope=\"row\">"+x+"</th><td id=\"block"+x+"\">"+0+"</td> </tr>");
        }

        for(var x=0 ; x<memoryMap.length ; x++) {
            $("#inputSimulation").append("<div class=\"text-center col\" id=\"input"+x+"\">"+memoryMap[x]+"</div>");
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
