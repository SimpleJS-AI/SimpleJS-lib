class NeuralNetwork {
    constructor(input, hidden, output, lr = 0.1) {
        this.input = input;
        this.hidden = hidden;
        this.output = output;

        this.lr = lr;

        this.w_input_hidden = new Matrix(this.hidden, this.input);
        this.w_input_hidden.randomize();
        this.w_hidden_output = new Matrix(this.output, this.hidden);
        this.w_hidden_output.randomize();

        this.b_hidden = new Matrix(this.hidden, 1);
        this.b_hidden.randomize();
        this.b_output = new Matrix(this.output, 1);
        this.b_output.randomize();


    }
    ff(input, debug = false) {
        if(input.length !== this.input) return false;

        let inputMatrix = new Matrix(1, input.length, [input]).swap();
        //console.table(inputMatrix.data);

        let hiddenMatrix = this.w_input_hidden.multiply(inputMatrix);
        hiddenMatrix.add(this.b_hidden);
        hiddenMatrix.mapData(this.sigmoid);
        //console.table(hiddenMatrix.data)

        let outputMatrix = this.w_hidden_output.multiply(hiddenMatrix);
        outputMatrix.add(this.b_output);
        outputMatrix.mapData(this.sigmoid);
        //console.table(outputMatrix.data);

        console.table([input, outputMatrix.swap().data[0]]);
        return debug ?  [inputMatrix, hiddenMatrix, outputMatrix] : outputMatrix.swap().data[0] ;
    }

    bp(input, answer) {              //TODO : sort by output and hidden (easier to add more hidden layers)
        if(input.length !== this.input || answer.length !== this.output) return false;
        let [inputMatrix, hiddenMatrix, outputMatrix] = this.ff(input, true);
        let e_output = new Matrix(1, answer.length, [answer]).swap();
        //let outputMatrix = new Matrix(1, output.length, [output]).swap();
        e_output.add(outputMatrix.mapDataS(x => -x));
        console.table(e_output.data);
        //console.table(this.w_hidden_output.data);
        let e_hidden = this.w_hidden_output.swap().multiply(e_output);
        console.table(this.w_hidden_output.swap().data);
        console.table(e_hidden.data);

        let g_output = outputMatrix.mapDataS(x => x * (1 - x));
        g_output.multiply(e_output);
        g_output.scalarMultiply(this.lr);

        //console.table(g_output.data);

        let g_hidden = hiddenMatrix.mapDataS(x => x * (1 - x));
        g_hidden.multiply(e_hidden);
        g_hidden.scalarMultiply(this.lr);

        //console.table(g_hidden.data);

        let d_output = g_output.multiply(hiddenMatrix.swap());
        let d_hidden = g_hidden.multiply(inputMatrix.swap());
        console.table(this.w_hidden_output.data);
        this.w_hidden_output.add(d_output);
        this.w_input_hidden.add(d_hidden);
        this.b_output.add(g_output);
        this.b_hidden.add(g_hidden);
        console.table(this.w_hidden_output.data);



    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

}


class Matrix {
    constructor(rows, columns, data) {  // Create a matrix
        this.rows = rows;
        this.columns = columns;
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = data !== undefined && data[i] !== undefined && data[i][j] !== undefined ? data[i][j] : 0;
            }
        }
    }

    multiply(param) { // multiply by another matrix
        if (param.rows !== this.columns) return false;
        let output = new Matrix(this.rows, param.columns);
        for (let i = 0; i < output.rows; i++) {
            for (let j = 0; j < output.columns; j++) {
                output.data[i][j] = 0;
                for (let k = 0; k < this.columns; k++) {
                    output.data[i][j] += this.data[i][k] * param.data[k][j];
                }
            }
        }
        return output;
    }

    scalarMultiply(param) { // multiply by a scalar
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] *= param;
            }
        }
    }

    add(param) {   // add another matrix or a scalar
        if (param instanceof Matrix && (param.rows !== this.rows || param.columns !== this.columns)) return false; // if param is a matrix AND the dimensions are not the same -> return
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let x = param instanceof Matrix ? param.data[i][j] : param;
                this.data[i][j] += x;
            }
        }
    }
    subtract(param){
        let result = new Matrix(this.rows, this.columns, this.data)
        if (param instanceof Matrix && (param.rows !== this.rows || param.columns !== this.columns)) return false; // if param is a matrix AND the dimensions are not the same -> return
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let x = param instanceof Matrix ? param.data[i][j] : param;
                result.data[i][j] -= x;
            }
        }
        return result;
    }

    mapData(f) { // apply a function to each element of the matrix
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = f(this.data[i][j]);
            }
        }
    }

    mapDataS(f) { // Static version (not really static)
        let result = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                result.data[i][j] = f(this.data[i][j]);
            }
        }
        return result
    }


    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    swap() { // swap rows and columns
        let output = new Matrix(this.columns, this.rows);
        for (let i = 0; i < output.rows; i++) {
            for (let j = 0; j < output.columns; j++) {
                output.data[i][j] = this.data[j][i];
            }
        }
        return output;
    }

}


function test(){
    let nn = new NeuralNetwork(2, 2, 1, 0.1);
    let inputs = [  [0, 0], [0, 1], [1, 0], [1, 1] ];
    let results = [ [0], [1], [1], [0] ];
    for (let i = 0; i < 100; i++) {
        let index = Math.floor(Math.random() * 4);
        nn.bp(inputs[index], results[index]);
    }
}
let nn = new NeuralNetwork(2,2, 1, 0.1);
function test2(){
    for (let i = 0; i < 1; i++) {
        let a = Math.random()/2;
        let b = Math.random()/2;
        console.log(a, b, a+b);
        nn.bp([a,b], [a+b]);
    }
    nn.ff([0.5, 0.2]);
}


let inputs = [  [0, 0], [0, 1], [1, 0], [1, 1] ];
let results = [ [0], [1], [1], [0] ];
let canvas = document.getElementById("testCanvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = 'black';
ctx.fillRect(0,0, canvas.width, canvas.height);
//window.requestAnimationFrame(visualTest);
function visualTest(){
    let index = Math.floor(Math.random() * 4);
    nn.bp(inputs[index], results[index]);
    let a = Math.floor(Math.random()*20-10)/10;
    let b = Math.floor(Math.random()*20-10)/10;
    let c = nn.ff([a,b]);
    ctx.fillStyle = `rgb(${c[0]*255}, ${c[0]*255}, ${c[0]*255})`;
    ctx.fillRect((a+1)*canvas.width/2, (b+1)*canvas.height/2, 20, 20);
    window.requestAnimationFrame(visualTest);
}
