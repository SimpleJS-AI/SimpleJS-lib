
class NeuralNetwork {
    constructor(input, hidden, output, lr = 0.1) {
        this.input = input;
        this.hidden = hidden;
        this.output = output;

        this.lr = lr;

        this.w_input_hidden = math.zeros(this.hidden, this.input+1);
        this.w_input_hidden = math.map(this.w_input_hidden, () => Math.random() * 2 - 1);
        this.w_hidden_output = math.zeros(this.output, this.hidden+1);
        this.w_hidden_output = math.map(this.w_hidden_output, () => Math.random() * 2 - 1);

        /*this.b_hidden = math.map(math.zeros(this.hidden), () => Math.random() * 2 - 1);
        this.b_output = math.map(math.zeros(this.output), () => Math.random() * 2 - 1);*/
        this.b_hidden = Math.random() * 2 - 1;
        this.b_output = Math.random() * 2 - 1;
    }

    activation(x) {
        return 1 / (1 + Math.exp(-x));
    }

    d_activation(x) {
        return x * (1 - x);
    }

    ff(input, debug = false) {
        if(input.length !== this.input) return false;
        input.push(this.b_hidden);
        let inputMatrix = math.matrix(input);
        let hiddenMatrix = math.multiply(inputMatrix, math.transpose(this.w_input_hidden));
        hiddenMatrix = math.map(hiddenMatrix, this.activation);
        hiddenMatrix = math.concat(hiddenMatrix, [this.b_output]);  //Concat: add bias [1,2] + [3] = [1,2,3]
        let outputMatrix = math.multiply(hiddenMatrix, math.transpose(this.w_hidden_output));
        outputMatrix = math.map(outputMatrix, this.activation);
        return debug ? [inputMatrix,hiddenMatrix,outputMatrix] : outputMatrix.toArray();
    }

    bp(desired_input, desired) {
        let input = [...desired_input];
        if(desired_input.length !== this.input || desired.length !== this.output) return false;
        let [inputMatrix, hiddenMatrix, outputMatrix] = this.ff(input, true);
        let e_output = math.subtract(desired, outputMatrix);
        let g_output = math.map(outputMatrix, this.d_activation);
        g_output = math.dotMultiply(g_output, e_output);
        let g_hidden = math.map(hiddenMatrix, this.d_activation);
        g_hidden._data.pop();
        g_hidden._size[0]--;
        g_hidden = math.dotMultiply(g_hidden, math.multiply(g_output, math.subset(this.w_hidden_output, math.index(math.range(0, this.w_hidden_output.size()[0]), math.range(0, this.w_hidden_output.size()[1]-1)))));
        let d_output = math.multiply(math.transpose(math.matrix([g_output._data])), math.matrix([hiddenMatrix._data]));
        d_output = math.dotMultiply(d_output, this.lr);
        let d_hidden = math.multiply(math.transpose(math.matrix([g_hidden._data])), math.matrix([inputMatrix._data]));
        d_hidden = math.dotMultiply(d_hidden, this.lr);
        this.w_hidden_output = math.add(this.w_hidden_output, d_output);
        this.w_input_hidden = math.add(this.w_input_hidden, d_hidden);
        return [input, outputMatrix._data]

    }
}


class Genetic {
    constructor(populationSize, nnInput, nnHidden, nnOutput, nnLR, objClass, ...args) {
        this.popSize = populationSize;
        this.population = [];
        for (let i = 0; i < this.popSize; i++) {
            this.population.push(new Individual(nnInput, nnHidden, nnOutput, nnLR, objClass, ...args));
        }
    }

    get(index) {
        return this.population[index].obj;
    }

    getBest() {

    }

    evolve(newSize = this.popSize) {
        this.population = select(this.population, newSize);
        this.population = crossover(this.population);
        this.population = mutate(this.population);
    }

    select(population, newSize) {
        return null;
    }

    crossover(population) {
        return null;
    }

    mutate(population) {
        return null;
    }



}

class Individual {
    constructor(nnInput, nnHidden, nnOutput, nnLR, objClass, ...args) {
        this.nn = new NeuralNetwork(nnInput, nnHidden, nnOutput, nnLR);
        this.fitness = 0;
        this.obj = new objClass(this,...args);
    }
    setFitness(fitnessValue){
        this.fitness = fitnessValue;
    }
}

class Test {
    constructor(individual, a, b, c) {
        this.individual = individual;
        this.a = a;
        this.b = b;
        this.c = c;
    }
    setFitness(fitnessValue){
        this.individual.setFitness(fitnessValue);
    }
}












/*
let nn2 = new NeuralNetwork(2, 3, 1, .5);


const inputs = [  [0, 0], [0, 1], [1, 0], [1, 1] ];
const results = [ [0], [1], [1], [0] ];
let canvas = document.getElementById("testCanvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = 'black';
ctx.fillRect(0,0, canvas.width, canvas.height);
//window.requestAnimationFrame(visualTest);
function visualTest(){
    for (let i = 0; i < 100; i++) {
        let index = Math.floor(Math.random() * 4);
        console.log(index);
        console.table(nn2.bp(inputs[index], results[index]));
        let a = Math.floor(Math.random()*50)/50;
        let b = Math.floor(Math.random()*50)/50;
        let c = nn2.ff([a,b]);
        ctx.fillStyle = `rgb(${c[0]*255}, ${c[0]*255}, ${c[0]*255})`;
        ctx.fillRect(a*canvas.width, b*canvas.height, canvas.width/50, canvas.height/50);
    }
    window.requestAnimationFrame(visualTest);
}
*/
