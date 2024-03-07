const ctx = document.getElementById("canvas").getContext("2d");
const CANVAS_STYLE = "rgb(255,255,255)";

$(async () => {

    $("#buttonStart").on( "click", async () => {
        $("#startWindow").hide()
        $("#workingWindow").show()
        const GLOBAL = {
            cols: $("#inputCols").val()*1,
            rows: $("#inputRows").val()*1,
            count: $("#inputItems").val()*1,
            maxInRow: $("#inputItemsInRow").val()*1,
            maxInCol: $("#inputItemsInCol").val()*1
        }

        ctx.fillStyle = CANVAS_STYLE;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        RedrawTable (GLOBAL);

        while (true)
        {
            let array = new Array(GLOBAL.cols*GLOBAL.rows).fill(0);
            let counter = 0;
            for (let i=1; i<1000; i++)
            {
                let X = Math.round(Math.random()*(GLOBAL.cols-1));
                let Y = Math.round(Math.random()*(GLOBAL.rows-1));

                if (array[X+Y*GLOBAL.cols] == 1) continue;

                if (!IsChecked(GLOBAL, array, X, Y)) continue;

                counter++;
                array[X+Y*GLOBAL.cols] = 1;
            }


            if (counter > GLOBAL.count - 2)
            {
                clearTable(GLOBAL)
                fillTable(GLOBAL, array)
                $("#countText").val(counter)
                await sleep();
            }
            if (counter >= GLOBAL.count)
                break;
        }

    })
})

function RedrawTable (GLOBAL)
{
    for (let i=0; i<GLOBAL.cols; i++)
        ctx.strokeRect(i*canvas.width/GLOBAL.cols, 0, canvas.width/GLOBAL.cols, canvas.height)
    
    for (let j=0; j<GLOBAL.rows; j++)
        ctx.strokeRect(0, j*canvas.height/GLOBAL.rows, canvas.width, canvas.height/GLOBAL.rows)
}

function fillTable(GLOBAL, array, color = "blue")
{
    const scaleX = canvas.width/GLOBAL.cols;
    const scaleY = canvas.width/GLOBAL.rows;

    let rowsCount = new Array(GLOBAL.rows).fill(0);
    for (let x=0; x<GLOBAL.cols; x++)
    {
        for (let y=0; y<GLOBAL.rows; y++)
        {
            if (array[x+y*GLOBAL.cols] == 0) continue;

            rowsCount[y]++;
            if (rowsCount[y] > 3)
                return;

            ctx.beginPath();
            ctx.arc(x*scaleX+scaleX/2, y*scaleY+scaleY/2, 5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();        
        }
    }
    return;
}

function clearTable(GLOBAL)
{
    const scaleX = canvas.width/GLOBAL.cols;
    const scaleY = canvas.width/GLOBAL.rows;

    for (let x=0; x<GLOBAL.cols; x++)
    {
        for (let y=0; y<GLOBAL.rows; y++)
        {
            ctx.beginPath();
            ctx.arc(x*scaleX+scaleX/2, y*scaleY+scaleY/2, 5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fill();        
        }
    }
}

function IsChecked(GLOBAL, array, x, y)
{
    let checkCTX = {
        glb: GLOBAL,
        array: array,
        x: x,
        y: y
    }

    if (!CheckRow(checkCTX) || !CheckCol(checkCTX) || !CheckUp(checkCTX) || !CheckDown(checkCTX)) return false;

    return true;

    function CheckRow(ctx)
    {
        let countInRow = 0;
        for (let i=0; i<ctx.glb.cols; i++)
        {
            if (ctx.array[i+ctx.y*ctx.glb.cols] == 0) continue;
            
            countInRow++;
            if (countInRow == ctx.glb.maxInRow) return false;
        }
        return true;
    }
    function CheckCol(ctx)
    {
        let countInCol = 0;
        for (let i=0; i<ctx.glb.rows; i++)
        {
            if (ctx.array[ctx.x+i*ctx.glb.cols] == 0) continue;
            
            countInCol++;
            if (countInCol == ctx.glb.maxInCol) return false;
        }
        return true;        
    }
    function CheckUp(ctx)
    {
        if (y-1 < 0) return true;

        if (ctx.array[(ctx.x-1)+(y-1)*ctx.glb.cols] == 1) return false;
        if (ctx.array[(ctx.x+1)+(y-1)*ctx.glb.cols] == 1) return false;

        return true;
    }
    function CheckDown(ctx)
    {
        if (y+1 > ctx.rows) return true;

        if (ctx.array[(ctx.x-1)+(y+1)*ctx.glb.cols] == 1) return false;
        if (ctx.array[(ctx.x+1)+(y+1)*ctx.glb.cols] == 1) return false;

        return true;
    }
}

function sleep()
{
    return new Promise(ok => {
        setTimeout(ok, 1)
    })
}
